(function($) {
	'use strict';
	var MarkdownEditor = function(ele, opt) {
		this.$element = ele,
		this.defaults = {
            debug: false,
			codeMirror: {
                theme: 'mirrormark',
                tabSize: '4',
                indentWithTabs: true,
                lineWrapping: true,
                extraKeys: {
                    "Enter": 'newlineAndIndentContinueMarkdownList',
                },
                mode: 'markdown',
            },
			buttons: [
                { name: "mainHeader", className: "fa fa-header"},
                { name: "subHeader", className: "fa fa-header fa-sm"},
                { name: "bold", className: "fa fa-bold"},
                { name: "italicize", className: "fa fa-italic" },
                { name: "blockquote", className: "fa fa-quote-left" },
                { name: "link", className: "fa fa-link" },
                { name: "image", className: "fa fa-image" },
                { name: "unorderedList", className: "fa fa-list" },
                { name: "orderedList", className: "fa fa-list-ol" },
                { name: "code", className: "fa fa-code" },
                { name: "preview", className: "fa fa-search" },
                { name: "fullScreen", className: "fa fa-expand" },
			],
			additionalButtons: [],
			disabledButtons:[],
		},
		this.options = $.extend({}, this.defaults, opt);
	}

	MarkdownEditor.prototype = {
        debug: function() {
        },
		setCodeMirror: function() {
			this.cm = CodeMirror.fromTextArea(this.$element[0], this.options.codeMirror);
		},
		setToolbar: function(options) {
            var cm = this.cm;
			var cmWrapper = cm.getWrapperElement();
			var toolbar = $('<ul/>').addClass('mirrormark-toolbar').insertBefore($(cmWrapper));
			this.options.buttons.map(function(button) {
                var item = $('<li/>').addClass(button.name),
                    anchor = $('<a/>').addClass(button.className);
                anchor.appendTo(item).click(function(e) {
                    cm.focus();
                    button.callback();
                });
                toolbar.append(item);
			});
		},
		insertAround: function(start, end) {
			var doc = this.cm.getDoc();
			var cursor = doc.getCursor();

			if (doc.somethingSelected()) {
				var selection = doc.getSelection();
				doc.replaceSelection(start + selection + end);
			} else {
				doc.replaceRange(start + end, { line: cursor.line, ch: cursor.ch });
				doc.setCursor({ line: cursor.line, ch: cursor.ch + start.length })
			}
		},
		insertBefore: function(insertion, cursorOffset) {
			var doc = this.cm.getDoc();
			var cursor = doc.getCursor();

			if (doc.somethingSelected()) {
				var selections = doc.listSelections();
				selections.forEach(function(selection) {
					var pos = [selection.head.line, selection.anchor.line].sort();

					for (var i = pos[0]; i <= pos[1]; i++) {
						doc.replaceRange(insertion, { line: i, ch: 0 });
					}

					doc.setCursor({ line: pos[0], ch: cursorOffset || 0 });
				});
			} else {
				doc.replaceRange(insertion, { line: cursor.line, ch: 0 });
				doc.setCursor({ line: cursor.line, ch: cursorOffset || 0 })
			}
		}
	};

	$.fn.mdEditor = function(options) {
        var markdownEditor = new MarkdownEditor(this, options);
        markdownEditor.setCodeMirror();
        markdownEditor.setToolbar();
		return this;
	};
})(window.jQuery);
