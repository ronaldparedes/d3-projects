import * as d3 from "d3"

async function runViz() {
  // 1. Access Data
  const dataset = await d3.csv("./planets.csv")
  const xAccessor = d => +d.hzd
  const yAccessor = d => +d.mass
  const rAccessor = d => +d.radius
  const nameAccessor = d => d.name
  const tempColor = [
    {
      name: "too hot",
      color: "#f0563f",
      desc:
        "On planets orbiting close to their respective suns, surface water evaporates into space.",
    },
    {
      name: "just right",
      color: "#a7c039",
      desc:
        "Any water present on a planet orbiting here can remain liquid, given the right atmospheric pressure.",
    },
    {
      name: "too cold",
      color: "#0a9c9d",
      desc:
        " Here planets orbit far from their suns, so any surface water remains frozen.",
    },
  ]
  // 2. Create Chart Dimensions
  const dimensions = {
    width: 960,
    height: 1160,
    margin: {
      top: 60,
      right: 50,
      bottom: 50,
      left: 50,
    },
  }
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // 3. Draw Canvas
  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
  const bounds = wrapper
    .append("g")
    .attr("id", "bounds")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    )
  // 4. Create Scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([dimensions.margin.left, dimensions.boundedWidth])
  const yScale = d3
    .scaleLog()
    .domain(d3.extent(dataset, yAccessor))
    .range([0, dimensions.boundedHeight])
    .nice()
  const rScale = d3
    .scaleSqrt()
    .domain(d3.extent(dataset, rAccessor))
    .range([3.2, 24])
  // .range([3.2304221661137325, 23.921332344869043]);
  // .range([5, 30]);

  // 5. Draw Data
  const planets = bounds
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "planet")
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("r", d => rScale(rAccessor(d)))
    .style("fill", d => {
      if (xAccessor(d) < -1) {
        return tempColor[0].color
      } else if (xAccessor(d) < 1) {
        return tempColor[1].color
      } else {
        return tempColor[2].color
      }
    })

  // 6. Draw Peripherals
  const yAxisGen = d3.axisLeft().scale(yScale)
  const yAxis = bounds
    .append("g")
    .call(
      yAxisGen
        .tickValues([0.1, 1, 10, 100, 1000, 10000])
        .tickFormat(d3.format(",.5"))
    )
    .style("color", "#aaa")
  yAxis.selectAll(".domain").remove()

  const yAxisTickLabels = yAxis.selectAll(".tick")
  yAxisTickLabels
    .append("text")
    .attr("class", "y-axis-label")
    .text(d => (d < 1 ? "earth's" : "earth"))
    .attr("fill", "currentColor")
    .attr("x", -9)
    .attr("dy", "1.8em")
  yAxisTickLabels
    .append("text")
    .attr("class", "y-axis-label")
    .text(d => (d <= 1 ? "mass" : "masses"))
    .attr("fill", "currentColor")
    .attr("x", -9)
    .attr("dy", "3.2em")

  const yGrid = bounds
    .append("g")
    .call(
      yAxisGen.tickValues([0.1, 10, 1000]).tickSize(dimensions.boundedWidth)
    )
    .style("color", "#aaa")
    .style("transform", `translateX(${dimensions.boundedWidth}px)`)
  yGrid.selectAll(".tick > line").attr("stroke-dasharray", "1,3")
  yGrid.selectAll(".domain, text").remove()

  const xAxisGen = d3
    .axisTop()
    .scale(xScale)
    .tickValues([-1, 1])
    .tickSize(dimensions.boundedHeight)

  const xGrid = bounds
    .append("g")
    .call(xAxisGen)
    .style("color", "#aaa")
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)
  xGrid.selectAll(".domain").remove()
  xGrid.selectAll(".tick > text").remove()
  xGrid.selectAll(".tick > line").attr("stroke-dasharray", "1,3")

  const xAxisLabels = d3
    .select(".x-axis-label-group")
    .selectAll("div")
    .data(tempColor)
    .enter()
    .append("div")
    .attr("class", "x-axis-label")
    .style("width", () => `${xScale(-1) * 0.85}px`)
    .style(
      "transform",
      (d, i) => `translateX(${i * xScale(-1) + dimensions.margin.left}px)`
    )

  xAxisLabels
    .append("h3")
    .html(d => d.name)
    .style("color", d => d.color)
  xAxisLabels.append("p").html(d => d.desc)

  const lifeBox = bounds
    .append("rect")
    .attr("id", "lifeBox")
    .attr("x", xScale(-1))
    .attr("y", yScale(0.1))
    .attr("width", xScale(1) - xScale(-1))
    .attr("height", yScale(10) - yScale(0.1))
    .style("transform", "translate(0.5px, 0.5px)")

  const labeledPlanets = ["Earth", "Mars", "Venus", "Mercury", "Kepler-186f"]
  labeledPlanets.forEach(planetName => {
    const labledPlanet = planets
      .filter(e => nameAccessor(e) === planetName)
      .node()
    const x = +labledPlanet.attributes.cx.value
    const y = +labledPlanet.attributes.cy.value
    const r = +labledPlanet.attributes.r.value
    const planetLabel = bounds
      .append("text")
      .text(planetName)
      .attr("class", "planet-label")
      .style("transform", `translate(${x + r + 5}px, ${y}px)`)
  })

  //* 7. Setup interactions
  const tooltip = d3.select(".tooltip")
  function onMouseOver() {
    const r = +this.attributes.r.value
    const x = +this.attributes.cx.value + dimensions.margin.left + r
    const y = +this.attributes.cy.value + dimensions.margin.top - r
    tooltip.style("opacity", 1)
    const { name, radius, mass } = d3.select(this).datum()
    tooltip.select(".name").html(name)
    tooltip.select(".radius").html(radius + "x Earth's radius")
    tooltip.select(".mass").html(mass + "x Earth's mass")
    tooltip.style("transform", `translate(${x}px, calc(-100% + ${y}px))`)
  }
  function onMouseLeave() {
    tooltip.style("opacity", 0)
  }
  bounds.selectAll(".planet").on("mouseover", onMouseOver)
  bounds.selectAll(".planet").on("mouseleave", onMouseLeave)
}

export default runViz
