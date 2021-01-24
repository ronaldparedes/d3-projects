import React, { useEffect } from "react"
import styled from "styled-components"
import Layout from "../components/layout"
import mapViz from "../components/mapViz"

const StyledContainer = styled.div`
  font-family: "Neue Helvetica W02", "Helvetica Neue", Helvetica, Arial,
    sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #112739;
  width: 100vw;
  height: 100vmax;
`

const StyledTooltip = styled.div`
  opacity: 0;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 5rem;
  min-height: 3rem;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid grey;
  pointer-events: none;
  border-radius: 5px;
  padding: 5px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 300ms ease-in-out, opacity 100ms ease-in-out;
  .state-name {
    text-transform: uppercase;
    font-size: 0.85rem;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .state-covid-values,
  .covid-date {
    color: #5c5c5c;
    font-size: 0.8rem;
    ul {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }
    li {
      margin: 2px 0px;
    }
  }
`
const StyledHeading = styled.h1`
  color: #fff;
  font-weight: 200;
  margin-bottom: 5px;
  @media (max-width: 720px) {
    font-size: 1.4rem;
  }
`
const StyledInfo = styled.p`
  color: lightcoral;
  margin: 0;
`
const StyledCredit = styled.p`
  color: #a0a0a0;
  margin: 0;
  a {
    text-decoration: none;
    color: #cfcfcf;
    &:hover {
      cursor: pointer;
      color: #a1ecf7;
    }
  }
`
export default function Map() {
  useEffect(() => {
    mapViz()
  }, [])
  return (
    <Layout>
      <StyledContainer>
        <StyledHeading>Covid Cases In the US</StyledHeading>
        <StyledInfo>
          Hover / Click on a State to get the latest Covid info.
        </StyledInfo>
        <StyledCredit>
          Covid data from
          <a href="https://www.covidtracking.com/"> covidtracking.com</a>
        </StyledCredit>

        <div id="wrapper" style={{ marginTop: "3rem" }}>
          <StyledTooltip className="tooltip">
            <div className="state-name"></div>
            <div className="covid-date"></div>
            <div className="state-covid-values"></div>
          </StyledTooltip>
        </div>
      </StyledContainer>
    </Layout>
  )
}
