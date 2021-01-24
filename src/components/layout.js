import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import Brand from "../components/brand"
import { Height } from "../styles/variables"

const StyledLayout = styled.div`
  background-color: ${props => props.theme.backgroundColor || "white"};
  margin: 3rem auto;
  margin-bottom: 0;
`
const StyledHeader = styled.header`
  display: block;
  background-color: black;
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  border-bottom: 1px solid white;
  z-index: 999;
`
const StyledMain = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 0.7rem;
`
const StyledMenu = styled.nav`
  display: flex;
`
const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  height: ${Height.header};
  font-size: 1.2rem;
  @media (max-width: 720px) {
    font-size: 1rem;
  }

  &:focus,
  &:hover {
    color: lightblue;
  }
  &.active,
  &:focus,
  &:hover {
    color: #a1ecf7;
  }
  margin-right: 1rem;
`

const Main = styled.main`
  margin-top: ${Height.header};
`

const layout = ({ children, theme }) => {
  return (
    <StyledLayout theme={theme}>
      <StyledHeader>
        <StyledMain>
          <Brand />
          <StyledMenu>
            <StyledLink to="/histogram" activeClassName="active">
              Histogram
            </StyledLink>
            <StyledLink to="/map" activeClassName="active">
              Map
            </StyledLink>
            <StyledLink to="/goldielocks" activeClassName="active">
              Goldielocks
            </StyledLink>
          </StyledMenu>
        </StyledMain>
      </StyledHeader>
      <Main>{children}</Main>
    </StyledLayout>
  )
}

export default layout
