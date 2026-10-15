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

  // 日期框：禁掉过去的日期，最多约到一年后；输错后重选自动藏报错
  var dateFieldInit = document.getElementById("date");
  if (dateFieldInit) {
    var pad2 = function (n) { return (n < 10 ? "0" : "") + n; };
    var nowD = new Date();
    var minS = nowD.getFullYear() + "-" + pad2(nowD.getMonth() + 1) + "-" + pad2(nowD.getDate());
    var maxD = new Date(nowD); maxD.setFullYear(maxD.getFullYear() + 1);
    var maxS = maxD.getFullYear() + "-" + pad2(maxD.getMonth() + 1) + "-" + pad2(maxD.getDate());
    dateFieldInit.setAttribute("min", minS);
    dateFieldInit.setAttribute("max", maxS);
    dateFieldInit.addEventListener("change", function () {
      var de = document.getElementById("date-error");
      if (de && dateFieldInit.validity.valid) de.style.display = "none";
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // 日期校验：手机浏览器上年份输成 6 位数时，原生框的值会作废，这里拦下并提示重选
      var dateField = document.getElementById("date");
      var dateErr = document.getElementById("date-error");
      if (dateErr) dateErr.style.display = "none";
      if (dateField && !dateField.validity.valid) {
        if (dateErr) dateErr.style.display = "block";
        dateField.focus();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = "发送中… / Sending…";
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

  // footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
