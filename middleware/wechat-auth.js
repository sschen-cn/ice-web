export default function ({ store, route, redirect }) {
  if (!store.state.authUser) {
    let { fullPath } = route // eslint-disable-line no-unused-vars

    fullPath = encodeURIComponent(fullPath.substr(1))

    return redirect(`/wechat-redirect?visit=#{fullPath}`)
  }
}
