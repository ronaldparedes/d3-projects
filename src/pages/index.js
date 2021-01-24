import React from "react"
import CustomCursor from "../components/CustomCursor"
import Layout from "../components/layout"
import { Link } from "gatsby"
import styled from "styled-components"
import d3logo from "../assets/d3Logo.svg"
import { Height } from "../styles/variables"

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: #112739;
  width: 100%;
  /* height: 100%; */
  height: calc(100vmax - ${Height.header});
  .logoCont {
    position: absolute;
    width: 100vw;
    height: calc(100vmax - ${Height.header});
    filter: drop-shadow(0 1vw 0.6vw rgba(200, 200, 256, 0.2));
  }
  .d3logo {
    opacity: 1;
    width: 100%;
    height: 100%;
    background-color: #112739;
    mask: url(${d3logo}) 0 0 / 100vw 100vh no-repeat;
    z-index: 0;
  }
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.08) 2px,
      transparent 2px
    ),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 2px, transparent 2px),
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;
`
const StyledLink = styled(Link)`
  font-family: "Neue Helvetica W02", "Helvetica Neue", Helvetica, Arial,
    sans-serif;
  font-weight: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 2rem;
  margin: 2rem;
  z-index: 1;
  &.active,
  &:focus,
  &:hover {
    color: palevioletred;
  }
`
export default function Home() {
  return (
    <Layout theme={{ backgroundColor: "#112739" }}>
      <Main>
        <div className="logoCont">
          <div className="d3logo"></div>
        </div>

        <StyledLink to="/histogram" activeClassName="active">
          Histogram
        </StyledLink>
        <StyledLink to="/map" activeClassName="active">
          Map
        </StyledLink>
        <StyledLink to="/goldielocks" activeClassName="active">
          Goldielocks
        </StyledLink>
      </Main>
      <CustomCursor />
    </Layout>
  )
}
