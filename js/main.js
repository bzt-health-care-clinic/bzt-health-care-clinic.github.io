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

  // booking form -> FormSubmit (emails shirley.zqx@gmail.com)
  var form = document.getElementById("booking-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
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
