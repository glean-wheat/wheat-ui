/*
 * @Author: wugaoliang 
 * @Date: 2022-04-13 09:17:39 
 * @Last Modified by: wugaoliang
 * @Last Modified time: 2022-04-19 09:37:10
 */
function fetchSource (entry) {
  return fetch(entry).then((res) => {
    return res.text()
  })
}

export default function importEntryHtml (app) {
  fetchSource(app.entry).then((html) => {
      console.log('html:', html);
      // 获取html中的head和body,并替换为自定义标签，一个html只能有一个head和一个body
      const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)[0].replace(/<head/i, '<web-sandbox-head').replace(/<\/head>/i, '</web-sandbox-head>');
      const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[0].replace(/<body/i, '<web-sandbox-body').replace(/<\/body>/i, '</web-sandbox-body>');
      const _html = head + body;
      // 将html字符串转化为DOM结构
      const htmlDom = document.createElement('div')
      htmlDom.innerHTML = _html
      console.log('html:', htmlDom)
      
      // 获取静态资源
      getSource(htmlDom, app);
      console.log('app', app);

      // 获取web-sandbox-head元素
      const webSandboxHead = htmlDom.querySelector('web-sandbox-head')
      // 如果有远程css资源，则通过fetch请求
      if (app.source.links.size) {
        getExternalStyleSheets(app, webSandboxHead, htmlDom)
      } else {
        app.onLoad(htmlDom)
      }
  
      // 如果有远程js资源，则通过fetch请求
      if (app.source.scripts.size) {
        getExternalScripts(app, htmlDom)
      } else {
        app.onLoad(htmlDom)
      }
    }).catch((e) => {
      console.error('加载html出错', e)
    })
}

/**
 * 获取head和body中的link和script标签链接地址，并删除link和script标签
 * @param {HTMLElement} htmlDom 
 * @param {CustomElementConstructor} app 
 */

function getSource(htmlDom, app) {
  const headLinks = htmlDom.querySelectorAll('web-sandbox-head link');
  const headScripts = htmlDom.querySelectorAll('web-sandbox-head script');
  const bodyScripts = htmlDom.querySelectorAll('web-sandbox-body script');
  // 删除head和body中的link和script标签
  headLinks.forEach((link) => {
    const linkUrl = link.getAttribute('href');
    // 计入source缓存中
    app.source.links.set(linkUrl, {
      code: '', // 代码内容
    });
    link.remove();
  });
  headScripts.forEach((script) => {
    const scriptUrl = script.getAttribute('src');
    app.source.scripts.set(scriptUrl, {
      code: '', // 代码内容
    });
    script.remove();
  });
  bodyScripts.forEach((script) => {
    const scriptUrl = script.getAttribute('src');
    app.source.scripts.set(scriptUrl, {
      code: '', // 代码内容
    });
    script.remove();
  });
}

/**
 * 获取link远程资源
 * @param app 应用实例
 * @param webSandboxHead web-sandbox-head
 * @param htmlDom html DOM结构
 * 更加完整的请求方式请移步一下链接
 * https://github.com/kuitos/import-html-entry/blob/09cc30adb60317556ac35b2d58e08a8398d75007/src/index.js#L68
 */
 export function getExternalStyleSheets (app, webSandboxHead, htmlDom) {
  const linkEntries = Array.from(app.source.links.entries())
  // 通过fetch请求所有css资源
  const fetchLinkPromise = []
  for (const [entry] of linkEntries) {
    fetchLinkPromise.push(fetchSource(app.entry + entry))
  }

  Promise.all(fetchLinkPromise).then((res) => {
    for (let i = 0; i < res.length; i++) {
      const code = res[i]
      // 拿到css资源后放入style元素并插入到web-sandbox-head中
      const link2Style = document.createElement('style')
      link2Style.textContent = code
      webSandboxHead.appendChild(link2Style)
    }

    // 处理完成后执行onLoad方法
    app.onLoad(htmlDom)
  }).catch((e) => {
    console.error('加载css出错', e)
  })
}

/**
 * 获取js远程资源
 * @param app 应用实例
 * @param htmlDom html DOM结构
 * 更加完整的请求方式请移步一下链接
 * https://github.com/kuitos/import-html-entry/blob/09cc30adb60317556ac35b2d58e08a8398d75007/src/index.js#L84
 */
 export function getExternalScripts (app, htmlDom) {
  const scriptEntries = Array.from(app.source.scripts.entries())
  // 通过fetch请求所有js资源
  const fetchScriptPromise = []
  for (const [entry, info] of scriptEntries) {
    // 如果是内联script，则不需要请求资源
    fetchScriptPromise.push(info.code ? Promise.resolve(info.code) :  fetchSource(app.entry + entry))
  }

  Promise.all(fetchScriptPromise).then((res) => {
    for (let i = 0; i < res.length; i++) {
      const code = res[i]
      // 将代码放入缓存，再次渲染时可以从缓存中获取
      scriptEntries[i][1].code = code
    }

    // 处理完成后执行onLoad方法
    app.onLoad(htmlDom)
  }).catch((e) => {
    console.error('加载js出错', e)
  })
}