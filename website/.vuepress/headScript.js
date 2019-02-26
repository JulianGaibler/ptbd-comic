window.__setTheme = () => {
    let userTheme = localStorage.user_theme
    let defaultTheme = 'light'
    document.documentElement.setAttribute(
        'data-theme',
        userTheme || defaultTheme,
    )
}
window.__setLayout = () => {
    let userLayout = localStorage.user_layout
    let defaultLayout = 'auto'
    document.documentElement.setAttribute(
        'data-layout',
        userLayout || defaultLayout,
    )
}
__setTheme()
__setLayout()
