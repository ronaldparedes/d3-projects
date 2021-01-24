import * as d3 from "d3"
import * as topojson from "topojson-client"
import { withPrefix } from "gatsby"

async function mapViz() {
  // 1. Access Data
  const usTopo = await d3.json(withPrefix("/states-albers-10m.json"))
  const datasetCovid = await d3.json(
    "https://api.covidtracking.com/v1/states/current.json"
  )
  const stateAbr = {
    Alabama: "AL",
    Alaska: "AK",
    Arizona: "AZ",
    Arkansas: "AR",
    California: "CA",
    Colorado: "CO",
    Connecticut: "CT",
    Delaware: "DE",
    Florida: "FL",
    Georgia: "GA",
    Hawaii: "HI",
    Idaho: "ID",
    Illinois: "IL",
    Indiana: "IN",
    Iowa: "IA",
    Kansas: "KS",
    Kentucky: "KY",
    Louisiana: "LA",
    Maine: "ME",
    Maryland: "MD",
    Massachusetts: "MA",
    Michigan: "MI",
    Minnesota: "MN",
    Mississippi: "MS",
    Missouri: "MO",
    Montana: "MT",
    Nebraska: "NE",
    Nevada: "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    Ohio: "OH",
    Oklahoma: "OK",
    Oregon: "OR",
    Pennsylvania: "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    Tennessee: "TN",
    Texas: "TX",
    Utah: "UT",
    Vermont: "VT",
    Virginia: "VA",
    Washington: "WA",
    "West Virginia": "WV",
    Wisconsin: "WI",
    Wyoming: "WY",
    "District of Columbia": "DC",
  }

  const stateNameAccessor = d => d.properties.name
  const stateIndexAccessor = d => {
    let stateIndex = null
    datasetCovid.forEach((state, index) => {
      if (state.state === stateAbr[d]) {
        stateIndex = index
        return
      }
    })
    return stateIndex
  }
  const stateCovidValsAccessor = d =>
    datasetCovid[stateIndexAccessor(stateNameAccessor(d))]

  const formatInt = d3.format(",")
  const dateParser = d3.timeParse("%Y%m%d")
  const dateFormat = d3.timeFormat("%b %e, %Y")

  // 2. Create Chart Dimensions
  const dimensions = {
    width: window.innerWidth * 0.9,
    height: window.innerWidth * 0.7,
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // 3. Draw Canvas
  const vbWidth = 975
  const vbHeight = 610
  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    .attr("viewBox", [0, 0, vbWidth, vbHeight])
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("background-color", "#112739")
  const bounds = wrapper
    .append("g")
    .attr("id", "bounds")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    )

  // 4. Create Scales

  const tooltipXScale = d3
    .scaleLinear()
    .domain([0, vbWidth])
    .range([0, dimensions.width])
  const tooltipYScale = d3
    .scaleLinear()
    .domain([0, vbHeight])
    .range([0, (vbHeight * dimensions.width) / vbWidth])

  // 5. Draw Data

  const states = bounds.append("g")
  states
    .selectAll("path")
    .data(topojson.feature(usTopo, usTopo.objects.states).features)
    .enter()
    .append("path")
    .attr("fill", "palevioletred")
    .attr("d", d3.geoPath())
    .attr("stroke", "#112739")
    .attr("stroke-width", "0.15%")

  // 6. Draw Peripherals

  // 7. Setup interactions
  states
    .selectAll("path")
    .on("mouseenter", onMouseEnter)
    .on("mouseleave", onMouseLeave)

  const tooltip = d3.select(".tooltip")
  const stateName = d3.select(".state-name")
  const covidDate = d3.select(".covid-date")
  const stateCovidVals = d3.select(".state-covid-values")
  function onMouseEnter(event, d) {
    const [xPos, yPos] = d3.geoPath().centroid(d)
    d3.select(this).style("fill", "papayawhip")
    stateName.text(stateNameAccessor(d))
    covidDate.text(dateFormat(dateParser(stateCovidValsAccessor(d).date)))
    stateCovidVals.html(`
    <ul>
      <li>Total Positive: ${formatInt(
        stateCovidValsAccessor(d).positiveCasesViral
      )}</li>
      <li>Total Deaths: ${formatInt(
        stateCovidValsAccessor(d).deathConfirmed
      )} </li>
      <li>New Positive: ${formatInt(
        stateCovidValsAccessor(d).positiveIncrease
      )}</li>
      <li>New Deaths: ${formatInt(stateCovidValsAccessor(d).deathIncrease)}</li>
    </ul>
    `)
    const tooltipHeight = tooltip.node().getBoundingClientRect().height
    const tooltipWidth = tooltip.node().getBoundingClientRect().width
    const scaledXPos = tooltipXScale(xPos)
    const scaledYPos = tooltipXScale(yPos)
    tooltip.style(
      "transform",
      `translate(${
        scaledXPos < dimensions.width / 2
          ? scaledXPos + tooltipWidth * 0.2
          : scaledXPos - tooltipWidth * 1.2
      }px, ${
        scaledYPos < vbHeight * 0.4
          ? scaledYPos
          : scaledYPos - tooltipHeight * 1.2
      }px)`
    )
    tooltip.style("opacity", 1)
  }
  function onMouseLeave(event, d) {
    d3.select(this).style("fill", "palevioletred")
    tooltip.style("opacity", 0)
  }
  window.addEventListener("resize", () => {
    dimensions.width = window.innerWidth < 700 ? window.innerWidth * 0.9 : 700
    dimensions.height = window.innerWidth * 0.7
    wrapper.attr("width", dimensions.width).attr("height", dimensions.height)
    tooltipXScale.range([0, dimensions.width])
    tooltipYScale.range([0, (vbHeight * dimensions.width) / vbWidth])
  })
}

export default mapViz
