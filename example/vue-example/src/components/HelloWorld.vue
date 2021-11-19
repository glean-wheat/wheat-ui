<template>
  <div class="hello">
    <wheat-button @click="showModal">显示弹框</wheat-button>
    <wheat-modal title="title" :visible="visible">
      <div slot="content">弹框内容</div>
    </wheat-modal>
  </div>
</template>

<script>
import "web-component-wheat-ui";
import "web-component-wheat-ui/dist/static/variables.css";

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      visible: false
    };
  },
  mounted() {
    const MyModalDom = document.querySelector("wheat-modal");
    MyModalDom.addEventListener("onCancel", value => {
      const {
        detail: { visible }
      } = value;
      console.log("触发取消方法", value, visible);
      this.visible = "false";
    });

    MyModalDom.addEventListener("onConfirm", value => {
      console.log("触发确定方法", value);
      this.visible = "false";
      this.hidden();
    });
  },
  methods: {
    showModal() {
      console.log("click");
      this.visible = true;
    },
    hidden() {
      this.visible = "false";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
