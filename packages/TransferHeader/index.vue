<template>
			<div class="anchor" :id="title">
        <span> {{title}} <a :href="'#'+title">#</a></span>
      </div>
</template>

<script>
import moment from 'moment'
	export default {
		data() {
			return {
			}
    },
    props: {
      title: {
        type: String
      },
    },
		mounted() {
    },
    methods:{

    }
	}
</script>

<style scoped lang="scss">
a{
  text-decoration: none !important ;
  cursor:pointer;
  -webkit-text-decoration-skip: objects;
  color: #39f;
  background: 0 0;
  cursor: pointer;
  -webkit-transition: color .2s ease;
  transition: color .2s ease;
}
.anchor{
  font-weight: 500;
  margin: 2.5rem 0 1.2rem;
  position: relative;
  span{
        display: inline-block;
        background: #fff;
        padding: 0 5px 0 18px;
        position: relative;
        margin-left: 30px;
        font-size: 14px;
        a{
          opacity: 0;
          -webkit-transition: opacity .2s ease-in-out;
          transition: opacity .2s ease-in-out;
        }
  }
  &:hover{
      span{
        a{
          opacity: 1;
          color: #5cadff;
          text-decoration: none
        }
      }
  }
  &:before{
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: #ccc;
    position: absolute;
    top: 10px;
    left: 0;
  }
}
</style>
