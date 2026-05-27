(function() {
  const slides = document.querySelectorAll('.carousel-slide')
  const dots = document.querySelectorAll('.carousel-dot')
  let current = 0
  const total = slides.length
  let timer = null

  function goTo(index) {
    slides[current].classList.remove('active')
    dots[current].classList.remove('active')
    current = (index + total) % total
    slides[current].classList.add('active')
    dots[current].classList.add('active')
  }

  function next() {
    goTo(current + 1)
  }

  function startAuto() {
    stopAuto()
    timer = setInterval(next, 5000)
  }

  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null }
  }

  // Dot click
  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      goTo(parseInt(this.dataset.index))
      startAuto()
    })
  })

  // Pause on hover
  document.addEventListener('mouseenter', stopAuto, { capture: true })
  document.addEventListener('mouseleave', startAuto, { capture: true })

  // Touch swipe support
  let touchStartX = 0
  let touchStartY = 0
  document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }, { passive: true })
  document.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - touchStartX
    var dy = e.changedTouches[0].clientY - touchStartY
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      goTo(current + (dx < 0 ? 1 : -1))
      startAuto()
    }
  })

  startAuto()
})()
