import React, {useState, useRef, useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import * as antdComponent from 'antd'
import * as styleContent from './table.scss'
import {cloneDeep} from 'lodash';
import classNames from 'classnames';
import { VariableSizeGrid as Grid } from 'react-window'
import ResizeObserver from 'rc-resize-observer';

const template = document.createElement('template')
const prefix = 'wheat-table'


const styles = `
<style>
    ${styleContent}
  </style>`

template.innerHTML = `
  ${styles}
  <div class="wheat-table">
  </div>
`

class WheatTable extends HTMLElement {
  constructor() {
    super()
    this.tableData = [];
    this.columns = [];
    this.tableProps = {};
    // 给默认值
    this.changeFn = (e) => {}
    this.setTableData = (e) => {}
    this.render()

  }

  setTableProps(props) {
    this.tableProps = props;
    this.renderReactElement();
  }

  setDataSource(data){
    this.tableDataSource = data.concat();
    this.renderReactElement();
  }
  parseRender (renderInfo, text, row) {
    const renderNode = (item, rowText, row) => {
      if(item === null) return null;
      const {componentName, tagName, ...other} = item
      if(antdComponent && componentName && antdComponent[componentName]){
        const Component = antdComponent[componentName]
        return <Component {...other}/>
      }
      return React.createElement(tagName, {...other}, item.children)
    }
    if(Array.isArray(renderInfo)){
      return renderInfo.map(item => {
        return renderNode(item, text, row)
      })
    } else {
      return renderNode(renderInfo, text, row)
    }
  }
  parseColumns(columns) {
    columns.forEach(item => {
      if(item.children && item.children.length){
        item.children = this.parseColumns(item.children);
      } else if (item.render){
        const renderFun = item.render;
        item.render = (text, row) => {
          return this.parseRender(renderFun(text, row), text, row)
        };
      }
    })
    return columns
  }

  setColumns(columns) {
    const columnsData = this.parseColumns(cloneDeep(columns));
    this.columns = columnsData
    this.renderReactElement()
  }

  
  renderReactElement() {
    const data = this.tableDataSource;
    const Table = antdComponent['Table']
    this.root.render((() => {
      const VirtualTable = () => {
        const { scroll } = this.tableProps;
        const columns = this.columns;
        const [tableWidth, setTableWidth] = useState(0);
        const [tableData, setTableData] = useState(data);
        this.setTableData = setTableData;
        const widthColumnCount = columns.filter(({ width }) => !width).length;
        const mergedColumns = columns.map((column) => {
          if (column.width) {
            return column;
          }
          return {
            ...column,
            width: Math.floor(tableWidth / widthColumnCount),
          };
        });
        const gridRef = useRef();
        const [connectObject] = useState(() => {
          const obj = {};
          Object.defineProperty(obj, 'scrollLeft', {
            get: () => {
              if (gridRef.current) {
                return gridRef.current?.state?.scrollLeft;
              }
              return null;
            },
            set: (scrollLeft) => {
              if (gridRef.current) {
                gridRef.current.scrollTo({
                  scrollLeft,
                });
              }
            },
          });
          return obj;
        });
        const resetVirtualGrid = () => {
          gridRef.current?.resetAfterIndices({
            columnIndex: 0,
            shouldForceUpdate: true,
          });
        };
        useEffect(() => resetVirtualGrid, [tableWidth]);
        const renderVirtualList = (rawData, { scrollbarSize, ref, onScroll }) => {
          ref.current = connectObject;
          const totalHeight = rawData.length * 48;
          return (
            <Grid
              ref={gridRef}
              className="virtual-grid"
              columnCount={mergedColumns.length}
              columnWidth={(index) => {
                const { width } = mergedColumns[index];
                return totalHeight > scroll.y && index === mergedColumns.length - 1
                  ? width - scrollbarSize - 1
                  : width;
              }}
              height={scroll.y}
              rowCount={rawData.length}
              rowHeight={() => 48}
              width={tableWidth}
              onScroll={({ scrollLeft }) => {
                onScroll({
                  scrollLeft,
                });
              }}
            >
              {({ columnIndex, rowIndex, style }) =>{
                const text = rawData[rowIndex][mergedColumns[columnIndex].dataIndex]
                const {children} = mergedColumns[columnIndex]
                if(children && children.length) {
                  return (
                    <div className='antd-cell-wrapper' style={{...style, display: 'flex'}}>
                      {children.map((item) => {
                        const childrenText = rawData[rowIndex][item.dataIndex]
                        return <div className='virtual-table-cell' style={{width: item.width, align: item.align || 'left'}}>{item.render ? item.render(childrenText, rawData[rowIndex], rowIndex) : childrenText}</div>
                      })}
                    </div>
                  )
                }
                return (
                  <div
                    className={classNames('virtual-table-cell antd-cell-wrapper', {
                      'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
                    })}
                    style={{
                      ...style, 
                      align: mergedColumns[columnIndex].align || 'left'
                    }}
                  >
                    {mergedColumns[columnIndex].render ? mergedColumns[columnIndex].render(text, rawData[rowIndex], rowIndex) : text}
                  </div>
                )
              }}
            </Grid>
          );
        };
        return (
          <ResizeObserver
            onResize={({ width }) => {
              setTableWidth(width);
            }}
          >
            <Table
              {...this.tableProps}
              className="virtual-table"
              columns={mergedColumns}
              pagination={false}
              dataSource={tableData}
              components={{
                body: renderVirtualList,
              }}
            />
          </ResizeObserver>
        );
      };
      return <VirtualTable columns={this.columns} dataSource={data} {...this.tableProps} />
    })());
  }

  connectedCallback() {
    this.renderReactElement()
  }
  render() {
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    const mountPoint = template.content.cloneNode(true);
    this._shadowRoot.appendChild(mountPoint);
    this.$table = this._shadowRoot.querySelector('.wheat-table')
    this.root = ReactDOM.createRoot(this.$table);
  }

}

// 判定是否已经被注册
!window.customElements.get(prefix) && window.customElements.define(prefix, WheatTable)
