import comicsMeta from '@dynamic/comics'

export default ({
	Vue, // the version of Vue being used in the VuePress app
	options, // the options for the root Vue instance
	router, // the router instance for the app
	siteData // site metadata
}) => {

	let x = require.context("../", true, /\/panel([0-9]*)\.(png|jpe?g)$/);
	x.keys().forEach(x => {
		console.log(x)
	})

	siteData.pages.forEach(page => {
		if (!page.regularPath.startsWith("/_comics")) return;
		console.log(page);
	})
}