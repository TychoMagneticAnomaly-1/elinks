/* These are examples for the ELinks SpiderMonkey scripting interface.
 * Place choice parts in a file named "hooks.js" in your ELinks configuration
 * directory (~/.elinks).
 */

elinks.keymaps.main["@"] = function () {
	elinks.location = elinks.location + "/..";
};

elinks.preformat_html_hooks = new Array();
elinks.preformat_html = function (cached) {
	for (var i in elinks.preformat_html_hooks)
		if (!elinks.preformat_html_hooks[i](cached))
			return false;

	return true;
};

elinks.goto_url_hooks = new Array();
elinks.goto_url_hook = function (url) {
	for (var i in elinks.goto_url_hooks){ 
		url = elinks.goto_url_hooks[i](url);
		if (false === url) return false;
	}

	return url;
};

elinks.follow_url_hooks = new Array();
elinks.follow_url_hook = function (url) {
	for (var i in elinks.follow_url_hooks) {
		url = elinks.follow_url_hooks[i](url);
		if (false === url) return false;
	}

	return url;
};

function root_w00t(cached) {
	cached.content = cached.content.replace(/root/g, "w00t");
	return true;
};
elinks.preformat_html_hooks.push(root_w00t);

function mangle_deb_bugnumbers(cached) {
	if (!cached.uri.match(/^[a-z0-9]+:\/\/[a-z0-9A-Z.-]+debian\.org/)
	    && !cached.uri.match(/changelog\.Debian/))
		return true;

	var num_re = /([0-9]+)/g;
	var rewrite_closes_fn = function (str) {
		return str.replace(num_re,
		                 '<a href="http://bugs.debian.org/$1">$1</a>');
	}
	/* Debian Policy Manual 4.4 footnote 16 */
	var closes_re = /closes:\s*(?:bug)?\#?\s?\d+(?:,\s*(?:bug)?\#?\s?\d+)*/gi;

	cached.content = cached.content.replace(closes_re, rewrite_closes_fn);

	return true;
}
elinks.preformat_html_hooks.push(mangle_deb_bugnumbers);

function block_pr0n(uri) {
	if (uri.match(/pr0n/)) {
		elinks.alert('No pr0n!');
		return "";
	}

	return true;
}
elinks.follow_url_hooks.push(block_pr0n);

do_file(elinks.home + 'smartprefixes_bookmarks.js');
do_file(elinks.home + 'smartprefixes_classic.js');