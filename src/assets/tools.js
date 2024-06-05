
function getUrl(path) {
    let temp = import.meta.env
    let base_url = temp.BASE_URL
    base_url = base_url.slice(0, base_url.length - 1)
    let tmp = new URL(base_url + path, import.meta.url)
    let href = tmp.href
    return href
}

export { getUrl, }