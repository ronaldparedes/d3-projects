const canvas = document.getElementById("canvas")
const fileInput = document.getElementById("file-input")
const imageCont = document.getElementById("image-cont")
const blendBtn = document.querySelector("label[for='blend-histograms']")
const radioSelection = document.querySelectorAll('input[name="colors"]')

// Loads image file in Memory and calls the processImage funct
const pullFiles = imgPreselected => {
  let file = fileInput.files[0]
  const img = new Image()
  const fileReader = new FileReader()
  fileReader.addEventListener("load", () => {
    img.src = fileReader.result
  })
  img.onload = () => processImage(img)
  if (file) {
    fileReader.readAsDataURL(file)
    document.querySelector("#controls").classList.remove("visible")
  } else {
    img.src = imgPreselected
  }
}

const handleImageSelect = e => {
  d3.select("#histogram > svg").remove()
  d3.select("#image-cont > img").remove()
  document.getElementById("file-input-form").reset()
  document.querySelector("#controls").classList.remove("visible")
  pullFiles(e.target.currentSrc)
}

const imageRoll = Array.from(document.querySelector(".image-roll").children)
imageRoll.forEach(img => {
  img.addEventListener("click", handleImageSelect)
})

const rD = []
const gD = []
const bD = []
const rgbHistData = [rD, gD, bD]

// Processes the image file
const processImage = img => {
  imageCont.appendChild(img)
  const ctx = canvas.getContext("2d")
  ctx.canvas.width = img.naturalWidth
  ctx.canvas.height = img.naturalHeight
  ctx.drawImage(img, 0, 0)
  let imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  // Set the every Brightness value count to the default of 0 for each histogram color
  for (let brightVal = 0; brightVal < 256; brightVal++) {
    rD[brightVal] = gD[brightVal] = bD[brightVal] = 0
  }
  // Get the level of brightness per pixel and add to color array. Skip Alpha
  for (let i = 0; i < imgData.data.length; i += 4) {
    rD[imgData.data[i]]++
    gD[imgData.data[i + 1]]++
    bD[imgData.data[i + 2]]++
  }
  // Draw the Color Histograms with the data pulled from the image
  // Slight delay to avoid flicker
  setTimeout(() => {
    graphData({ rD, gD, bD })
  }, 100)
}

// When choosing a file, remove exising graph, image, and get new image
fileInput.onchange = () => {
  d3.select("#histogram > svg").remove()
  d3.select("#image-cont > img").remove()
  pullFiles()
}

const graphData = colorData => {
  // 1. Get Data
  const { rD, gD, bD } = colorData

  const yAccessor = d => d
  const xAccessor = (d, i) => i

  // 2. Set Dimensions
  const width = d3.min([window.innerWidth, 512])
  const psRatio = 100 / 256 // Photoshop histogram window ratio
  const dimensions = {
    width: width,
    height: width * psRatio,
    margin: {
      top: 30 * psRatio,
      right: 35,
      bottom: 55 * psRatio,
      left: 40,
    },
  }
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // 3. Set Scales

  // Combine pixel data into a single array to calculate a yDomainMax removing the outliers
  const rbgD = [...rD, ...gD, ...bD]
  const yDomainMax = d3.mean(rbgD) + d3.deviation(rbgD) * 3.5

  const yScale = d3
    .scaleLinear()
    .domain([0, yDomainMax])
    .range([dimensions.boundedHeight, 0])
    .clamp(true)
    .nice()
  const xScale = d3
    .scaleLinear()
    .domain([0, 255])
    .range([0, dimensions.boundedWidth])

  // 4. Draw Graph

  const graph = d3
    .select("#histogram")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
  const bounds = graph
    .append("g")
    .attr("id", "rbg")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    )
  const t = d3.transition().delay(500).duration(800).ease(d3.easeCubicOut)
  const drawHistogram = (channelData, colorName, color) => {
    const colorBars = bounds
      .append("g")
      .attr("id", `${colorName}-histogram`)
      .selectAll("rect")
      .data(channelData)
      .enter()
      .append("rect")
    colorBars
      .attr("x", (d, i) => xScale(xAccessor(d, i)))
      .attr("y", dimensions.boundedHeight)
      .attr("width", (d, i) => xScale(xAccessor(d, 1)))
      .attr("height", 0)
      .transition(t)
      .attr("y", d => yScale(yAccessor(d)))
      .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
      .attr("fill", color)
    document.getElementById("controls").classList.add("visible")
  }
  drawHistogram(rD, "red", "#df2f20")
  drawHistogram(gD, "green", "#32fc34")
  drawHistogram(bD, "blue", "#2534f1")

  // 5. Draw Peripherals
  const xAxisGen = d3
    .axisBottom()
    .scale(xScale)
    .tickValues([0, 64, 128, 192, 255])
  const yAxisGen = d3.axisLeft().scale(yScale).ticks(4)
  const xAxis = bounds
    .append("g")
    .call(xAxisGen)
    .attr("class", "axis")
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const yAxis = bounds.append("g").call(yAxisGen).attr("class", "axis")

  // 6. Setup Interactions

  blendBtn.addEventListener("change", () => handleBlend())
  let isBlendedHist = false
  // Blend and unBlend the rgb histograms when the button is toggled
  const handleBlend = () => {
    d3.selectAll("#red-histogram, #green-histogram, #blue-histogram").each(
      function () {
        d3.select(this)
          .selectAll("rect")
          .style("mix-blend-mode", isBlendedHist ? "normal" : "screen")
      }
    )
    blendBtn.firstChild.textContent = isBlendedHist ? "Blend" : "Unblend"
    isBlendedHist = !isBlendedHist
  }
  const unblend = () => {
    isBlendedHist ? handleBlend() : null
    blendBtn.classList.remove("active")
    blendBtn.classList.add("disabled")
  }

  const showColor = (colorShow, hide1, hide2) => {
    unblend()
    d3.select(`#${colorShow}-histogram`)
      .selectAll("rect")
      .transition(t)
      .attr("y", d => yScale(yAccessor(d)))
      .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
    d3.select(`#${hide1}-histogram`)
      .selectAll("rect")
      .transition(t)
      .attr("height", 0)
      .attr("y", dimensions.boundedHeight)
    d3.select(`#${hide2}-histogram`)
      .selectAll("rect")
      .transition(t)
      .attr("height", 0)
      .attr("y", dimensions.boundedHeight)
  }
  // Check which radio button "Color" option is selected
  let selectedRadio
  const checkSelected = () => {
    radioSelection.forEach(radio => {
      if (radio.checked) {
        selectedRadio = radio.value
        // Update histogram display based on which radio button is selected
        switch (selectedRadio) {
          case "rgb":
            blendBtn.classList.remove("disabled")
            d3.select("#red-histogram")
              .selectAll("rect")
              .transition(t)
              .attr("y", d => yScale(yAccessor(d)))
              .attr(
                "height",
                d => dimensions.boundedHeight - yScale(yAccessor(d))
              )
            d3.select("#green-histogram")
              .selectAll("rect")
              .transition(t)
              .attr("y", d => yScale(yAccessor(d)))
              .attr(
                "height",
                d => dimensions.boundedHeight - yScale(yAccessor(d))
              )
            d3.select("#blue-histogram")
              .selectAll("rect")
              .transition(t)
              .attr("y", d => yScale(yAccessor(d)))
              .attr(
                "height",
                d => dimensions.boundedHeight - yScale(yAccessor(d))
              )
            break
          case "red":
            unblend()
            showColor(selectedRadio, "green", "blue")
            break
          case "green":
            unblend()
            showColor(selectedRadio, "red", "blue")
            break
          case "blue":
            unblend()
            showColor(selectedRadio, "red", "green")
            break
          default:
            break
        }
      }
    })
  }

  radioSelection.forEach(radio => {
    radio.addEventListener("change", checkSelected)
  })
}
