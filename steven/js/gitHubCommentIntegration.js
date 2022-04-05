gitHubCommentIntegration = function(){
	var commentsLoaded = false;
	var commentsElement = null;
	var apiUrl = null;
	var isPrintMode = false;
  
	function appendComment(comment, bodyHtml) {
		var nameLink = document.createElement('a');
		nameLink.setAttribute('href', comment.user.html_url); 
		nameLink.appendChild(document.createTextNode(comment.user.login));
		nameLink.setAttribute('class', 'noprintlink');

		if (comment.user.login == 'dotnetjunkie') {
			// Replacing my GitHub name with my first name.
			nameLink = document.createTextNode('Steven');
		}

		var titleElement = document.createElement('h4');
		titleElement.id = 'comment-' + comment.id;

		titleElement.appendChild(nameLink);

		var createDate = new Date(comment.created_at).toLocaleString('en-us', { year: 'numeric', month: 'long', day: 'numeric' });
		titleElement.appendChild(document.createTextNode(' - ' + createDate));

		if (comment.created_at != comment.updated_at) {
			titleElement.appendChild(document.createTextNode(' (edited)'));
		}

		commentsElement.appendChild(titleElement);
		commentsElement.innerHTML += bodyHtml;
		commentsElement.appendChild(document.createElement('hr'));		
	};
  
	function isElementInViewport(el, bottomMargin) {
		var rect = el.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			(rect.bottom-bottomMargin) <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}  

	function loadCommentsWhenVisible() {
		if (commentsLoaded == true) return;
		
		if (isPrintMode || isElementInViewport(commentsElement, 400)) {
			commentsLoaded = true;
			commentsElement.innerHTML = '<br />Loading comments...<br /><br /><hr />';

			fetch(apiUrl, { headers: { 'Accept': 'application/vnd.github.v3.html+json' } })
			  .then(response => { return response.json() })
			  .then(comments => {
				commentsElement.innerHTML = '';
				if (comments.length == 0) {
					commentsElement.innerHTML = '<br />There are currently no comments.<br /><br /><hr />';
				}
				for (var i = 0; i < comments.length; i++) {
					appendComment(comments[i], comments[i].body_html);
				}
			  })
			  .catch (err => {
				commentsElement.innerHTML =
					'<br /><i>I\'m sorry. Something went wrong during the loading of the comments. ' +
					'You can view this post\'s comments by visiting <a href="{{ $gitHubIssueUrl }}">this GitHub issue</a>.</i><br /><br /><hr />';
			  });
		}
	}
	
	return {
		init:function(commentsElementName, gitHubApiUrl, pageIsViewedForPrinting) {
			commentsElement = document.getElementById(commentsElementName);
			apiUrl = gitHubApiUrl;
			isPrintMode = pageIsViewedForPrinting;
			
			loadCommentsWhenVisible();
			
			window.onresize = function(){ loadCommentsWhenVisible() };
			window.onscroll = function(){ loadCommentsWhenVisible() };
		}
	}
}();