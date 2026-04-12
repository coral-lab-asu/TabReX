window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Scroll-in reveal (Perceptual Observatory–style)
    var revealTargets = document.querySelectorAll('.section, .brand-hero, .footer');
    revealTargets.forEach(function(target) {
      target.classList.add('reveal');
    });

    /** Reveal any block already in (or mostly in) the viewport — fixes missed IO callbacks after layout. */
    function flushRevealsInView() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(function(el) {
        var r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh * 0.98) {
          el.classList.add('is-visible');
        }
      });
    }

    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0,
        rootMargin: '0px 0px 12% 0px'
      });

      revealTargets.forEach(function(target) {
        revealObserver.observe(target);
      });
    } else {
      revealTargets.forEach(function(target) {
        target.classList.add('is-visible');
      });
    }

    requestAnimationFrame(function() {
      flushRevealsInView();
    });

    window.addEventListener('load', function() {
      document.body.classList.add('is-loaded');
      document.body.classList.remove('loading');
      flushRevealsInView();
    });

    window.addEventListener('hashchange', flushRevealsInView);

    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

    // Back-to-top visibility
    var backToTop = $('.back-to-top');
    $(window).on('scroll', function () {
      if ($(this).scrollTop() > 300) backToTop.fadeIn();
      else backToTop.fadeOut();
    });

    // ── Animated qualitative demo ──
    var EXAMPLES = [
      {
        eyebrow: 'Example 1', title: 'Schema Mismatch',
        sourceText: 'The project involved Tejas, Junha, and Aparna, who are Researchers. Vivek is an Engineer.',
        tableHeaders: ['Name', 'Position', 'Team'],
        tableRows: [
          ['Tejas', 'Researcher', 'AI'],
          ['Junha', 'Researcher', 'AI'],
          ['Aparna', 'Researcher', 'AI'],
          ['Vivek', 'Engineer', 'AI']
        ],
        warnCols: [2],
        g1: [
          ['Tejas', 'Position', 'Researcher'],
          ['Junha', 'Position', 'Researcher'],
          ['Aparna', 'Position', 'Researcher'],
          ['Vivek', 'Position', 'Engineer']
        ],
        g2: [
          ['Tejas', 'Position', 'Researcher'],
          ['Tejas', 'Team', 'AI'],
          ['Junha', 'Position', 'Researcher'],
          ['Junha', 'Team', 'AI'],
          ['Aparna', 'Position', 'Researcher'],
          ['Aparna', 'Team', 'AI'],
          ['Vivek', 'Position', 'Engineer'],
          ['Vivek', 'Team', 'AI']
        ],
        g2extra: [1, 3, 5, 7],
        alignments: [
          { g1: 0, g2: 0, match: true },
          { g1: 1, g2: 2, match: true },
          { g1: 2, g2: 4, match: true },
          { g1: 3, g2: 6, match: true }
        ],
        traceTitle: 'Schema Mismatch',
        traceBody: 'Relation <strong>\'Team\'</strong> in g2 is an <strong>Extra Column</strong> not found in g1.<br><code>[Junha, -/Team, -/AI]</code> &rarr; Mismatch',
        resultHeaders: ['Name', 'Position', 'Team'],
        resultRows: [
          ['Tejas', 'Researcher', 'AI'],
          ['Junha', 'Researcher', 'AI'],
          ['Aparna', 'Researcher', 'AI'],
          ['Vivek', 'Engineer', 'AI']
        ],
        errCols: [2]
      },
      {
        eyebrow: 'Example 2', title: 'Entity Swap',
        sourceText: 'Sales for Q1 were $1000. Sales for Q2 were $1200.',
        tableHeaders: ['Quarter', 'Sales'],
        tableRows: [
          ['Q1', '$1200'],
          ['Q2', '$1000']
        ],
        warnCols: [1],
        g1: [
          ['Q1', 'Sales', '$1000'],
          ['Q2', 'Sales', '$1200']
        ],
        g2: [
          ['Q1', 'Sales', '$1200'],
          ['Q2', 'Sales', '$1000']
        ],
        g2extra: [],
        alignments: [
          { g1: 0, g2: 0, match: false },
          { g1: 1, g2: 1, match: false }
        ],
        traceTitle: 'Factual Mismatch (Value Swap)',
        traceBody: 'Values for aligned triplets do not match.<br><code>[Q1/Q1, Sales/Sales, $1000/$1200]</code> &rarr; Difference: $200',
        resultHeaders: ['Quarter', 'Sales'],
        resultRows: [
          ['Q1', '$1200'],
          ['Q2', '$1000']
        ],
        errCols: [1]
      },
      {
        eyebrow: 'Example 3', title: 'Aggregation Error',
        sourceText: 'Team A has 3 members. Team B has 4 members. Total members: 7.',
        tableHeaders: ['Team', 'Members'],
        tableRows: [
          ['Team A', '3'],
          ['Team B', '4'],
          ['Total', '12']
        ],
        warnCols: [],
        warnCells: [[2, 1]],
        g1: [
          ['Team A', 'Members', '3'],
          ['Team B', 'Members', '4'],
          ['Total', 'Members', '7']
        ],
        g2: [
          ['Team A', 'Members', '3'],
          ['Team B', 'Members', '4'],
          ['Total', 'Members', '12']
        ],
        g2extra: [],
        alignments: [
          { g1: 0, g2: 0, match: true },
          { g1: 1, g2: 1, match: true },
          { g1: 2, g2: 2, match: false }
        ],
        traceTitle: 'Aggregation Error',
        traceBody: 'Aggregation rubric failed. Expected <strong>7</strong> (from g1 or <code>SUM(3,4)</code>), but g2 has <strong>12</strong>.<br><code>[Total/Total, Members/Members, 7/12]</code>',
        resultHeaders: ['Team', 'Members'],
        resultRows: [
          ['Team A', '3'],
          ['Team B', '4'],
          ['Total', '12']
        ],
        errCells: [[2, 1]]
      }
    ];

    var demo = {
      el: $('#anim-demo'),
      stage: $('#anim-demo .anim-demo__stage'),
      phase: 0,
      timer: null,
      currentIdx: 0
    };

    var PHASE_DELAY = 2200;

    function esc(s) { return $('<span>').text(s).html(); }

    function tripletHtml(t, cls) {
      cls = cls || '';
      return '<div class="anim-triplet ' + cls + '">[' + esc(t[0]) + ', ' + esc(t[1]) + ', ' + esc(t[2]) + ']</div>';
    }

    function buildTableHtml(headers, rows, opts) {
      opts = opts || {};
      var h = '<table class="table is-bordered is-fullwidth"><thead><tr>';
      headers.forEach(function(hdr, ci) {
        var style = '';
        if (opts.warnCols && opts.warnCols.indexOf(ci) !== -1) style = ' style="background:#fff3cd"';
        if (opts.errCols && opts.errCols.indexOf(ci) !== -1) style = ' class="anim-err-cell"';
        h += '<th' + style + '>' + esc(hdr) + (opts.errCols && opts.errCols.indexOf(ci) !== -1 ? ' &#10060;' : '') + '</th>';
      });
      h += '</tr></thead><tbody>';
      rows.forEach(function(row, ri) {
        h += '<tr>';
        row.forEach(function(cell, ci) {
          var cls = '';
          if (opts.warnCols && opts.warnCols.indexOf(ci) !== -1) cls = ' style="background:#fffaf0"';
          if (opts.errCols && opts.errCols.indexOf(ci) !== -1) cls = ' class="anim-err-cell"';
          if (opts.warnCells) {
            opts.warnCells.forEach(function(wc) { if (wc[0] === ri && wc[1] === ci) cls = ' style="background:#fff3cd"'; });
          }
          if (opts.errCells) {
            opts.errCells.forEach(function(ec) { if (ec[0] === ri && ec[1] === ci) cls = ' class="anim-err-cell"'; });
          }
          h += '<td' + cls + '>' + esc(cell) + (opts.errCells ? (function() { var m = false; opts.errCells.forEach(function(ec) { if (ec[0] === ri && ec[1] === ci) m = true; }); return m ? ' &#10060;' : ''; })() : '') + '</td>';
        });
        h += '</tr>';
      });
      h += '</tbody></table>';
      return h;
    }

    function updatePhaseIndicator(phase) {
      demo.el.find('.anim-phase-dot').each(function() {
        var p = Number($(this).attr('data-phase'));
        $(this).removeClass('is-active is-done');
        if (p < phase) $(this).addClass('is-done');
        if (p === phase) $(this).addClass('is-active');
      });
      demo.el.find('.anim-phase-arrow').each(function(i) {
        $(this).toggleClass('is-active', i < phase);
      });
    }

    // Phase 0: show source text + generated table
    function renderPhase0(ex) {
      var html =
        '<div class="anim-source-table">' +
          '<div class="anim-panel" id="anim-left">' +
            '<p class="anim-panel__label">Source Text</p>' +
            '<div class="anim-panel__content"><p class="anim-panel__text">&ldquo;' + esc(ex.sourceText) + '&rdquo;</p></div>' +
          '</div>' +
          '<div class="anim-panel" id="anim-right">' +
            '<p class="anim-panel__label">Generated Table</p>' +
            '<div class="anim-panel__content">' + buildTableHtml(ex.tableHeaders, ex.tableRows, { warnCols: ex.warnCols, warnCells: ex.warnCells }) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="anim-graph-row" id="anim-graph-row"></div>' +
        '<div class="anim-bottom-row" id="anim-bottom-row"></div>';
      demo.stage.html(html);
      updatePhaseIndicator(0);
    }

    // Phase 1: graph triplets appear BELOW the source/table
    function renderPhase1(ex) {
      updatePhaseIndicator(1);

      var graphRow = $('#anim-graph-row');

      // Build graph panels side by side
      var g1Html = '<div class="anim-triplets">';
      ex.g1.forEach(function(t) { g1Html += tripletHtml(t); });
      g1Html += '</div>';

      var g2Html = '<div class="anim-triplets">';
      ex.g2.forEach(function(t, i) {
        var cls = ex.g2extra.indexOf(i) !== -1 ? 'is-extra' : '';
        g2Html += tripletHtml(t, cls);
      });
      g2Html += '</div>';

      graphRow.html(
        '<div class="anim-graph-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg><span>Canonicalize</span></div>' +
        '<div class="anim-source-table" id="anim-graph-panels">' +
          '<div class="anim-panel" id="anim-g1">' +
            '<p class="anim-panel__label">Source Graph (g1)</p>' +
            g1Html +
          '</div>' +
          '<div class="anim-panel" id="anim-g2">' +
            '<p class="anim-panel__label">Table Graph (g2)</p>' +
            g2Html +
          '</div>' +
        '</div>'
      );

      // Animate the graph row sliding in
      graphRow.addClass('is-visible');

      // Stagger triplet appearance
      setTimeout(function() {
        graphRow.find('.anim-triplet').each(function(i) {
          var el = $(this);
          setTimeout(function() { el.addClass('is-visible'); }, i * 80);
        });
      }, 300);
    }

    // Phase 2: draw alignment lines between g1 and g2 triplets
    function renderPhase2(ex) {
      updatePhaseIndicator(2);

      var graphPanels = $('#anim-graph-panels');
      var leftTriplets = $('#anim-g1 .anim-triplet');
      var rightTriplets = $('#anim-g2 .anim-triplet');

      // Add SVG overlay scoped to the graph panels
      graphPanels.css('position', 'relative');
      var svg = '<svg class="anim-align-overlay" id="anim-svg"></svg>';
      graphPanels.append(svg);

      ex.alignments.forEach(function(a, idx) {
        setTimeout(function() {
          var lt = $(leftTriplets.get(a.g1));
          var rt = $(rightTriplets.get(a.g2));
          var cls = a.match ? 'is-aligned' : 'is-misaligned';
          lt.addClass(cls);
          rt.addClass(cls);

          // Draw line relative to graphPanels
          var parentOff = graphPanels.offset();
          var ltOff = lt.offset();
          var rtOff = rt.offset();
          var x1 = ltOff.left + lt.outerWidth() - parentOff.left;
          var y1 = ltOff.top + lt.outerHeight() / 2 - parentOff.top;
          var x2 = rtOff.left - parentOff.left;
          var y2 = rtOff.top + rt.outerHeight() / 2 - parentOff.top;

          var lineClass = 'anim-align-line' + (a.match ? ' is-match' : ' is-mismatch');
          var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', x1);
          line.setAttribute('y1', y1);
          line.setAttribute('x2', x2);
          line.setAttribute('y2', y2);
          line.setAttribute('class', lineClass);
          document.getElementById('anim-svg').appendChild(line);

          var svgEl = document.getElementById('anim-svg');
          svgEl.setAttribute('viewBox', '0 0 ' + graphPanels.outerWidth() + ' ' + graphPanels.outerHeight());
          svgEl.style.width = graphPanels.outerWidth() + 'px';
          svgEl.style.height = graphPanels.outerHeight() + 'px';

          setTimeout(function() { $(line).addClass('is-visible'); }, 50);
        }, idx * 400);
      });

      // Mark extra g2 triplets
      setTimeout(function() {
        ex.g2extra.forEach(function(ei) {
          $(rightTriplets.get(ei)).addClass('is-misaligned');
        });
      }, ex.alignments.length * 400);
    }

    // Phase 3: show error trace + result table below everything
    function renderPhase3(ex) {
      updatePhaseIndicator(3);

      // Dim alignment lines
      $('.anim-align-overlay').css('opacity', '0.15');

      var bottomRow = $('#anim-bottom-row');
      var traceHtml =
        '<div class="anim-graph-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg><span>Error Trace</span></div>' +
        '<div class="anim-trace-card" id="anim-trace">' +
          '<p class="anim-trace-card__title">&#10060; Mismatch: ' + ex.traceTitle + '</p>' +
          '<div class="anim-trace-card__body">' + ex.traceBody + '</div>' +
          '<div class="anim-result-table" id="anim-result">' +
            buildTableHtml(ex.resultHeaders, ex.resultRows, { errCols: ex.errCols, errCells: ex.errCells }) +
          '</div>' +
        '</div>';

      bottomRow.html(traceHtml);
      bottomRow.addClass('is-visible');

      setTimeout(function() { $('#anim-trace').addClass('is-visible'); }, 100);
      setTimeout(function() { $('#anim-result').addClass('is-visible'); }, 400);
    }

    function stopDemo() {
      if (demo.timer) {
        clearTimeout(demo.timer);
        demo.timer = null;
      }
      demo.el.find('.anim-demo__play').text('\u25B6 Play').removeClass('is-playing');
    }

    function goToPhase(phase, ex) {
      stopDemo();
      demo.phase = 0;
      renderPhase0(ex);

      if (phase >= 1) {
        demo.phase = 1;
        renderPhase1(ex);
      }
      if (phase >= 2) {
        setTimeout(function() {
          demo.phase = 2;
          renderPhase2(ex);
        }, phase === 2 ? 1200 : 100);
      }
      if (phase >= 3) {
        setTimeout(function() {
          demo.phase = 3;
          renderPhase3(ex);
        }, phase === 3 ? 2400 : 200);
      }
      demo.phase = phase;
    }

    function playDemo(startPhase) {
      var ex = EXAMPLES[demo.currentIdx];
      startPhase = startPhase || 0;

      demo.el.find('.anim-demo__play').text('\u23F8 Pause').addClass('is-playing');

      function scheduleNext(p) {
        if (p > 3) {
          stopDemo();
          return;
        }
        demo.timer = setTimeout(function() {
          demo.phase = p;
          if (p === 0) renderPhase0(ex);
          else if (p === 1) renderPhase1(ex);
          else if (p === 2) renderPhase2(ex);
          else if (p === 3) renderPhase3(ex);
          updatePhaseIndicator(p);
          scheduleNext(p + 1);
        }, p === startPhase ? 0 : PHASE_DELAY);
      }

      scheduleNext(startPhase);
    }

    function loadExample(idx) {
      stopDemo();
      demo.currentIdx = idx;
      var ex = EXAMPLES[idx];
      demo.el.find('.anim-demo__eyebrow').text(ex.eyebrow);
      demo.el.find('.anim-demo__title').text(ex.title);
      demo.phase = 0;
      renderPhase0(ex);
    }

    // Init
    loadExample(0);

    // Tab switching
    $('.example-switcher__tab').on('click', function() {
      var idx = Number($(this).attr('data-example-idx'));
      $('.example-switcher__tab').removeClass('is-active').attr('aria-selected', 'false');
      $(this).addClass('is-active').attr('aria-selected', 'true');
      loadExample(idx);
    });

    // Play button
    demo.el.find('.anim-demo__play').on('click', function() {
      if (demo.timer) {
        stopDemo();
      } else {
        renderPhase0(EXAMPLES[demo.currentIdx]);
        playDemo(0);
      }
    });

    // Reset button
    demo.el.find('.anim-demo__reset').on('click', function() {
      stopDemo();
      demo.phase = 0;
      renderPhase0(EXAMPLES[demo.currentIdx]);
    });

    // Phase dot clicking
    demo.el.on('click', '.anim-phase-dot', function() {
      var p = Number($(this).attr('data-phase'));
      goToPhase(p, EXAMPLES[demo.currentIdx]);
    });

    // Auto-play on scroll into view
    var qualSection = document.getElementById('qualitative');
    if (qualSection && 'IntersectionObserver' in window) {
      var hasAutoPlayed = false;
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting && !hasAutoPlayed) {
            hasAutoPlayed = true;
            if (!demo.timer) {
              setTimeout(function() { playDemo(0); }, 400);
            }
          }
        });
      }, { threshold: 0.3 });
      observer.observe(qualSection);
    }

    var bibtexButton = document.getElementById('bibtex-copy-button');
    var bibtexCode = document.getElementById('bibtex-code');
    var bibtexStatus = document.getElementById('bibtex-copy-status');
    if (bibtexButton && bibtexCode) {
      var copyLabel = bibtexButton.querySelector('span:last-child');
      var resetTimer = null;
      bibtexButton.addEventListener('click', function() {
        var textToCopy = bibtexCode.innerText.trim();
        var onSuccess = function() {
          if (bibtexStatus) {
            bibtexStatus.textContent = 'Copied!';
          }
          if (copyLabel) {
            copyLabel.textContent = 'Copied';
          }
          if (resetTimer) {
            clearTimeout(resetTimer);
          }
          resetTimer = setTimeout(function() {
            if (bibtexStatus) {
              bibtexStatus.textContent = '';
            }
            if (copyLabel) {
              copyLabel.textContent = 'Copy BibTeX';
            }
          }, 2000);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(onSuccess);
        } else {
          var selection = window.getSelection();
          var range = document.createRange();
          range.selectNodeContents(bibtexCode);
          selection.removeAllRanges();
          selection.addRange(range);
          try {
            document.execCommand('copy');
            onSuccess();
          } catch (err) {
            if (bibtexStatus) {
              bibtexStatus.textContent = 'Copy failed';
            }
          }
          selection.removeAllRanges();
        }
      });
    }

})
