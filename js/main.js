// BZT Health Care Clinic — shared JS: mobile nav, FAQ accordion, booking form
document.addEventListener("DOMContentLoaded", function () {
  // mobile nav
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var open = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (o) {
        o.classList.remove("open");
        o.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!open) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  // booking form -> FormSubmit (activated; posts to encrypted endpoint)
  var form = document.getElementById("booking-form");

  // 日期框：纯文本输入，只收数字并自动补横杠 YYYY-MM-DD
  // （手机自带 date 框在部分浏览器上年份会吞下 6 位数，不用它了）
  var dateFieldInit = document.getElementById("date");
  if (dateFieldInit) {
    dateFieldInit.addEventListener("input", function () {
      var d = dateFieldInit.value.replace(/\D/g, "").slice(0, 8);
      var out = d;
      if (d.length > 4) out = d.slice(0, 4) + "-" + d.slice(4);
      if (d.length > 6) out = d.slice(0, 4) + "-" + d.slice(4, 6) + "-" + d.slice(6);
      dateFieldInit.value = out;
      var de = document.getElementById("date-error");
      if (de && /^\d{4}-\d{2}-\d{2}$/.test(out)) de.style.display = "none";
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // 日期校验：必须为 YYYY-MM-DD，且是真实存在、不早于今天、不超过一年后的日子
      var dateField = document.getElementById("date");
      var dateErr = document.getElementById("date-error");
      if (dateErr) dateErr.style.display = "none";
      var dateVal = dateField ? dateField.value : "";
      var dateBad = false;
      if (dateVal !== "") {
        var dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateVal);
        if (!dm) { dateBad = true; }
        else {
          var dyy = +dm[1], dmm = +dm[2], ddd = +dm[3];
          var dobj = new Date(dyy, dmm - 1, ddd);
          var t0 = new Date(); t0.setHours(0, 0, 0, 0);
          var tmax = new Date(t0); tmax.setFullYear(tmax.getFullYear() + 1);
          if (dobj.getFullYear() !== dyy || dobj.getMonth() !== dmm - 1 || dobj.getDate() !== ddd ||
              dobj < t0 || dobj > tmax) { dateBad = true; }
        }
      }
      if (dateBad) {
        if (dateErr) dateErr.style.display = "block";
        dateField.focus();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = document.documentElement.getAttribute("data-lang") === "en" ? "Sending…" : "发送中…";
      fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      }).then(function (res) {
        var ok = document.getElementById("form-success");
        var err = document.getElementById("form-error");
        if (res.ok) {
          if (ok) ok.style.display = "block";
          if (err) err.style.display = "none";
          form.reset();
          form.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          if (err) err.style.display = "block";
        }
      }).catch(function () {
        var err = document.getElementById("form-error");
        if (err) err.style.display = "block";
      }).finally(function () {
        btn.disabled = false;
        btn.textContent = original;
      });
    });
  }


  // ---- Language toggle (一键中英切换) ----
  var rootEl = document.documentElement;
  function applyLang(lang) {
    rootEl.setAttribute('data-lang', lang);
    rootEl.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
    try { localStorage.setItem('bzt-lang', lang); } catch (e) {}
    var tt = document.querySelector('title');
    if (tt) {
      var tv = lang === 'zh' ? tt.getAttribute('data-title-zh') : tt.getAttribute('data-title-en');
      if (tv) tt.textContent = tv;
    }
    document.querySelectorAll('[data-ph-zh]').forEach(function (el) {
      var pv = lang === 'zh' ? el.getAttribute('data-ph-zh') : el.getAttribute('data-ph-en');
      if (pv !== null) el.setAttribute('placeholder', pv);
    });
    document.querySelectorAll('[data-text-zh]').forEach(function (el) {
      var xv = lang === 'zh' ? el.getAttribute('data-text-zh') : el.getAttribute('data-text-en');
      if (xv !== null) el.textContent = xv;
    });
    document.querySelectorAll('.lang-toggle').forEach(function (b) {
      b.textContent = lang === 'zh' ? 'EN' : '中文';
      b.setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换到中文');
    });
  }
  var savedLang = null;
  try { savedLang = localStorage.getItem('bzt-lang'); } catch (e) {}
  var initialLang = savedLang || (((navigator.language || '').toLowerCase().indexOf('zh') === 0) ? 'zh' : 'en');
  applyLang(initialLang);
  document.querySelectorAll('.lang-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      applyLang(rootEl.getAttribute('data-lang') === 'zh' ? 'en' : 'zh');
    });
  });

  // footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
