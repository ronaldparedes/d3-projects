import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

const StyledBrand = styled.div`
  font-size: 1.7rem;
  display: flex;
  align-items: center;
  margin: 0 3rem;
`
const StyledLink = styled(Link)`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
`
const Brand = () => (
  <StyledBrand>
    <StyledLink to="/">D3 Projects</StyledLink>
  </StyledBrand>
)

export default Brand
