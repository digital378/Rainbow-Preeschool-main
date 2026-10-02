(function () {
  "use strict";

  function activateTabs(container) {
    if (container.dataset.ready) return;
    container.dataset.ready = "true";
    container.addEventListener("click", function (event) {
      var button = event.target.closest('[role="tab"]');
      if (!button || !container.contains(button)) return;
      selectTab(container, button);
    });
    container.addEventListener("keydown", function (event) {
      var current = event.target.closest('[role="tab"]');
      if (!current || !container.contains(current)) return;
      var buttons = Array.from(container.querySelectorAll('[role="tab"]'));
      var index = buttons.indexOf(current);
      var next = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % buttons.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = buttons.length - 1;
      else return;
      event.preventDefault();
      selectTab(container, buttons[next]);
      buttons[next].focus();
    });
  }

  function selectTab(container, selected) {
    var tablist = container.closest("[role=tablist]");
    var chapter = container.closest(".chapter");
    if (!tablist || !chapter) return;
    var panels = Array.from(chapter.querySelectorAll('[role="tabpanel"][aria-labelledby]'));
    var targetId = selected.getAttribute("aria-controls");
    var groupTabIds = Array.from(tablist.querySelectorAll("[role=tab]")).map(function (tab) {
      return tab.id;
    });
    tablist.querySelectorAll("[role=tab]").forEach(function (tab) {
      var active = tab === selected;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach(function (panel) {
      if (groupTabIds.indexOf(panel.getAttribute("aria-labelledby")) === -1) return;
      panel.hidden = panel.id !== targetId;
    });
  }

  function activateFaq(list) {
    if (list.dataset.ready) return;
    list.dataset.ready = "true";
    list.addEventListener("click", function (event) {
      var button = event.target.closest(".acc-head");
      if (!button || !list.contains(button)) return;
      var item = button.closest(".acc-item");
      var panel = document.getElementById(button.getAttribute("aria-controls"));
      var opening = button.getAttribute("aria-expanded") !== "true";
      list.querySelectorAll(".acc-head").forEach(function (otherButton) {
        if (otherButton === button) return;
        otherButton.setAttribute("aria-expanded", "false");
        var otherPanel = document.getElementById(otherButton.getAttribute("aria-controls"));
        if (otherPanel) otherPanel.hidden = true;
        otherButton.closest(".acc-item").classList.remove("open");
      });
      button.setAttribute("aria-expanded", String(opening));
      panel.hidden = !opening;
      item.classList.toggle("open", opening);
    });
  }

  function activateQuiz(card) {
    if (card.dataset.ready) return;
    card.dataset.ready = "true";
    var questions = Array.from(card.querySelectorAll(".quiz-question"));
    var check = card.querySelector("#quizCheck");
    var next = card.querySelector("#quizNext");
    var form = card.querySelector("#quizForm");
    var result = document.getElementById("quizResult");
    var scoreOutput = document.getElementById("quizScore");
    var replay = document.getElementById("quizReplay");
    var current = 0;
    var score = 0;
    var scored = false;

    function focusQuestion(index) {
      var legend = questions[index].querySelector("legend");
      legend.tabIndex = -1;
      legend.focus();
    }

    function currentQuestion() {
      return questions[current];
    }

    function updateProgress() {
      questions.forEach(function (question, index) {
        question.hidden = index !== current;
      });
    }

    check.addEventListener("click", function () {
      var question = currentQuestion();
      var selected = question.querySelector('input[type="radio"]:checked');
      if (!selected) {
        question.querySelector('input[type="radio"]').focus();
        return;
      }
      question.querySelectorAll('input[type="radio"]').forEach(function (input) {
        input.disabled = true;
      });
      var feedback = question.querySelector(".quiz-feedback");
      feedback.hidden = false;
      var correct = selected.dataset.correct === "true";
      feedback.classList.toggle("incorrect", !correct);
      if (correct && !scored) score += 1;
      scored = true;
      check.hidden = true;
      next.hidden = false;
      card.querySelector("#nextLabelNext").hidden = current === questions.length - 1;
      card.querySelector("#nextLabelFinish").hidden = current !== questions.length - 1;
      next.focus();
    });

    next.addEventListener("click", function () {
      if (current < questions.length - 1) {
        current += 1;
        scored = false;
        updateProgress();
        check.hidden = false;
        next.hidden = true;
        focusQuestion(current);
        return;
      }
      card.hidden = true;
      scoreOutput.textContent = score + " / " + questions.length;
      result.hidden = false;
      result.focus();
    });

    replay.addEventListener("click", function () {
      form.reset();
      questions.forEach(function (question) {
        question.querySelectorAll('input[type="radio"]').forEach(function (input) {
          input.disabled = false;
        });
        question.querySelector(".quiz-feedback").hidden = true;
        question.querySelector(".quiz-feedback").classList.remove("incorrect");
      });
      current = 0;
      score = 0;
      scored = false;
      updateProgress();
      result.hidden = true;
      card.hidden = false;
      check.hidden = false;
      next.hidden = true;
      focusQuestion(0);
    });
  }

  function bindOnApproach(element, callback) {
    var started = false;
    function start() {
      if (started) return;
      started = true;
      callback(element);
      observer && observer.disconnect();
    }
    element.addEventListener("focusin", start, { once: true });
    element.addEventListener("pointerdown", start, { once: true, passive: true });
    var observer = "IntersectionObserver" in window
      ? new IntersectionObserver(function (entries) {
          if (entries.some(function (entry) { return entry.isIntersecting; })) start();
        }, { rootMargin: "300px 0px" })
      : null;
    if (observer) observer.observe(element);
    else start();
  }

  document.querySelectorAll("[data-tabs]").forEach(function (tabs) {
    bindOnApproach(tabs, activateTabs);
  });
  var faq = document.getElementById("faqList");
  if (faq) bindOnApproach(faq, activateFaq);
  var quiz = document.getElementById("quizCard");
  if (quiz) bindOnApproach(quiz, activateQuiz);
})();