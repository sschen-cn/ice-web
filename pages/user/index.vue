<template lang='pug'>
.container
  .user(v-if='user')
    .user-header
      .user-header-text {{user.nickname}}
      img(:src='imageCDN + user.avatarUrl + "?imageView2/1/format/jpg/q/75/imageslim"')
    .user-address
      cell(title='收货地址')
      .user-content {{user.address}}
    .user-phone
      cell(title='电话')
      .user-contet {{user.phoneNumber}}
    .user-name
      cell(title='姓名')
      .user-content {{user.name}}

    .user-order(v-if='user.orders && user.orders.length > 0')
      cell(title='我的订单')
      .user-order-item(v-for='item in user.orders')
        img(:src='imageCDN + item.product.images[0] + "?imageView2/1/format/jpg/q/75/imageslim"')
        .user-order-intro
          .title {{item.product.title}}
          .content {{item.product.intro}}
        .user-order-price
          span ￥{{item.product.price}}
</template>

<script>
  import cell from '../../components/cell.vue'
  import { mapState } from 'vuex'

  export default {
    head () {
      return {
        title: '个人中心'
      }
    },

    computed: {
      ...mapState([
        'user',
        'imageCDN'
      ])
    },

    methods: {},

    beforeCreate () {
      this.$store.dispatch('fetchUserAndOrders')
    },

    components: {
      cell
    }
  }
</script>

<style scoped lang="sass" src='../../static/sass/user.sass'></style>
