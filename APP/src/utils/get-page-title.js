import defaultSettings from '@/settings'

const title = defaultSettings.title
//封装页面title
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
