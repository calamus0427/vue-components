<!--
 * @Author       : Calamus
 * @websit       : calamus.xyz
 * @Description  :
 * @FilePath     : /MeowMeowUI/packages/Button/index.html
 * @Date         : 2020-03-12 17:27:19
 * @LastEditors  : Calamus
 * @LastEditTime : 2020-03-12 17:27:20
 -->
 <template>
  <div class="x-button">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'x-button',
  props: {
    type: String
  }
}
</script>

<style scoped>
  .x-button {
      display: inline-block;
      padding: 3px 6px;
      background: #000;
      color: #fff;
  }
</style>
