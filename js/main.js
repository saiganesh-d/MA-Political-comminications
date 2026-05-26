/* M.A. in Political Communication — interactions */
(function () {
  'use strict';

  /* ---------------- Carousel ---------------- */
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var viewport = root.querySelector('.carousel__viewport');
    var track = root.querySelector('.carousel__track');
    var slides = Array.prototype.slice.call(track.children);
    var prev = root.querySelector('.carousel__btn--prev');
    var next = root.querySelector('.carousel__btn--next');
    var dotsWrap = root.querySelector('.carousel__dots');
    var index = 0;

    function perView() {
      var w = window.innerWidth;
      if (w <= 560) return 1;
      if (w <= 900) return 2;
      return 3;
    }
    function maxIndex() { return Math.max(0, slides.length - perView()); }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      var pages = maxIndex() + 1;
      for (var i = 0; i < pages; i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        (function (i) { b.addEventListener('click', function () { go(i); }); })(i);
        dotsWrap.appendChild(b);
      }
    }
    function update() {
      var slideW = slides[0].getBoundingClientRect().width;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      var offset = index * (slideW + gap);
      track.style.transform = 'translateX(' + (-offset) + 'px)';
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
          d.classList.toggle('is-active', i === index);
        });
      }
    }
    function go(i) { index = Math.max(0, Math.min(i, maxIndex())); update(); }
    function clamp() { if (index > maxIndex()) index = maxIndex(); }

    if (prev) prev.addEventListener('click', function () { go(index - 1); });
    if (next) next.addEventListener('click', function () { go(index + 1); });

    // touch swipe
    var startX = null;
    viewport.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      startX = null;
    });

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { buildDots(); clamp(); update(); }, 120);
    });

    buildDots(); update();
  });

  /* ---------------- Fees / Eligibility tabs ---------------- */
  document.querySelectorAll('.fees .tabs').forEach(function (tabs) {
    var card = tabs.closest('.fees-card');
    tabs.querySelectorAll('.tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var name = tab.getAttribute('data-tab');
        tabs.querySelectorAll('.tab').forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        card.querySelectorAll('.tab-panel').forEach(function (p) {
          p.classList.toggle('is-active', p.getAttribute('data-panel') === name);
        });
      });
    });
  });

  /* ---------------- Recognitions marquee ---------------- */
  (function () {
    var track = document.querySelector('[data-marquee] .marquee__track');
    if (!track) return;
    var badges = [
      'badge-1', 'badge-2', 'badge-3', 'badge-4', 'badge-5',
      'img-8', 'img-9', 'img-10', 'img-11', 'img-12', 'img-13', 'img-14',
      'img-15', 'img-16', 'img-18', 'img-20', 'img-21', 'img-22', 'img-23',
      'img-24', 'img-25', 'img-26', 'img-27', 'img-28', 'img-29'
    ];
    function fill() {
      badges.forEach(function (name) {
        var d = document.createElement('div');
        d.className = 'marquee__item';
        var img = document.createElement('img');
        img.src = 'img/badges/' + name + '.png';
        img.alt = '';
        d.appendChild(img);
        track.appendChild(d);
      });
    }
    fill(); fill(); // duplicate for seamless -50% loop
  })();

  /* ---------------- Mobile nav toggle ---------------- */
  (function () {
    var btn = document.querySelector('.nav-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      document.body.classList.toggle('nav-open', !open);
    });
  })();

  /* ---------------- Demo form guard ---------------- */
  document.querySelectorAll('form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thank you! This is a demo form — submissions are not yet connected to a backend.');
    });
  });
})();
