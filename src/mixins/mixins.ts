import img from "/404.png"

const mainMixin = {
  data() {
    return {}
  },
  methods: {
    imgError(e: any, src: any) {

      if (e?.target) {
        if (src) {


          e.target.src = src

        } else {

          e.target.src = img
        }
      }
    },



  }
}

export default mainMixin
