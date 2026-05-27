(function() {
  const carousel = document.getElementById('carousel')
  const dotsContainer = document.getElementById('carouselDots')

  // Fallback gradients when no images found
  const FALLBACKS = [
    'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    'linear-gradient(135deg, #0a192f 0%, #112240 50%, #1a365d 100%)',
    'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
  ]

  let slides = []
  let dots = []
  let current = 0
  let total = 0
  let timer = null

  function goTo(index) {
    if (total === 0) return
    slides[current].classList.remove('active')
    dots[current].classList.remove('active')
    current = ((index % total) + total) % total
    slides[current].classList.add('active')
    dots[current].classList.add('active')
  }

  function next() { goTo(current + 1) }

  function startAuto() {
    stopAuto()
    if (total > 1) timer = setInterval(next, 5000)
  }

  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null }
  }

  function buildCarousel(imagePaths) {
    var sources = imagePaths.length > 0 ? imagePaths : FALLBACKS

    sources.forEach(function(src, i) {
      var slide = document.createElement('div')
      slide.className = 'carousel-slide' + (i === 0 ? ' active' : '')
      if (imagePaths.length > 0) {
        slide.classList.add('carousel-slide-img')
        slide.style.backgroundImage = 'url(' + src + ')'
      } else {
        slide.style.background = src
      }
      carousel.insertBefore(slide, carousel.firstChild)

      var dot = document.createElement('button')
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '')
      dot.dataset.index = i
      dot.setAttribute('aria-label', 'Slide ' + (i + 1))
      dot.addEventListener('click', function() {
        goTo(parseInt(this.dataset.index))
        startAuto()
      })
      dotsContainer.appendChild(dot)
    })

    slides = document.querySelectorAll('.carousel-slide')
    dots = document.querySelectorAll('.carousel-dot')
    total = slides.length
  }

  // Try to load slides/N.png until one fails
  function tryLoadImage(index) {
    return new Promise(function(resolve, reject) {
      var img = new Image()
      img.onload = function() { resolve('slides/' + index + '.png') }
      img.onerror = function() { reject(new Error('not found')) }
      img.src = 'slides/' + index + '.png'
    })
  }

  async function loadSlides() {
    var images = []
    var index = 1
    while (true) {
      try {
        var path = await tryLoadImage(index)
        images.push(path)
        index++
      } catch (e) {
        break
      }
    }
    return images
  }

  // Init
  loadSlides().then(function(images) {
    buildCarousel(images)
    startAuto()

    // Pause on hover
    document.addEventListener('mouseenter', stopAuto, { capture: true })
    document.addEventListener('mouseleave', startAuto, { capture: true })

    // Touch swipe
    var touchStartX = 0, touchStartY = 0
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
  })
})()
