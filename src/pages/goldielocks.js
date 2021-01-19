import React, { useEffect } from "react"
import Layout from "../components/layout"
import styled from "styled-components"
import runViz from "../components/goldielocksViz"
import { Height } from "../styles/variables"

const StyledViz = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: ${Height.header};
  font-family: Arial, Helvetica, sans-serif;
  #wrapper {
    position: relative;
  }
  .description {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #aaa;
    width: 100%;
    a {
      color: #a1ecf7;
      text-decoration: none;
    }
    & h1 {
      font-family: "Neue Helvetica W02", "Helvetica Neue", Helvetica, Arial,
        sans-serif;
      font-weight: 200;
    }
    & p {
      max-width: 720px;
    }
    .credit {
      color: white;
    }
    & span {
      color: grey;
      font-size: small;
    }
  }
  .tooltip {
    opacity: 0;
    position: absolute;
    display: inline-block;
    background-color: rgba(255, 255, 255, 0.5);
    padding: 5px;
    pointer-events: none;
    color: black;
    transition: opacity 200ms ease-in;
  }
  .name {
    text-transform: uppercase;
    font-size: 1.2em;
    font-weight: 300;
  }
  .radius,
  .mass {
    font-size: 0.9em;
  }
  .planet {
    stroke: white;
    stroke-width: 0.4;
    fill-opacity: 0.6;
    &:hover {
      stroke: pink;
      stroke-width: 1;
    }
  }
  .planet-label {
    font-size: 0.8em;
    fill: #aaa;
    text-transform: lowercase;
    font-variant: small-caps;
    dominant-baseline: middle;
  }
  #lifeBox {
    fill: none;
    stroke: white;
    stroke-width: 2;
  }
  .y-axis-label {
    text-transform: uppercase;
  }
  .x-axis-label-group {
    position: absolute;
    color: #aaa;
  }
  .x-axis-label {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    position: absolute;
    margin-left: 0.8em;
  }
  .x-axis-label h3 {
    text-transform: uppercase;
    font-weight: 300;
    font-size: 16px;
  }
  .x-axis-label p {
    font-size: 13px;
  }
`

export default function Goldielocks() {
  useEffect(() => {
    console.log("Running effect")
    runViz()
  }, [])
  return (
    <Layout theme={{ backgroundColor: "black" }}>
      <StyledViz>
        <div className="description">
          <p className="credit">
            The Vizualization below is a recreation in D3 of the Goldielocks
            Worlds article published by the National Geographic:
            <a href="https://www.nationalgeographic.com/astrobiology/goldilocks-worlds/">
              &nbsp;Goldielocks Worlds&nbsp;
            </a>
            <br />
          </p>
          <h1>GOLDILOCKS WORLDS: JUST RIGHT FOR LIFE?</h1>
          <p>
            Of the 1,780 confirmed planets beyond our solar system, as many as
            16 are located in their star’s habitable zone, where conditions are
            neither too hot nor too cold to support life. Size also matters: A
            planet that’s too small can’t maintain an atmosphere; one that’s too
            large will have a crushing atmosphere. A recently detected planet
            493 light-years from Earth, Kepler-186f, is close to Earth's size
            and is located in its solar system's habitable zone.
          </p>
        </div>
        <div id="wrapper">
          <div className="x-axis-label-group"></div>
          <div className="tooltip">
            <div className="name"></div>
            <div className="radius"></div>
            <div className="mass"></div>
          </div>
        </div>
      </StyledViz>
    </Layout>
  )
}
