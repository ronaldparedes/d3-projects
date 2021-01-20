import React from "react"
import Layout from "../components/layout"
import styled from "styled-components"
import runViz from "../components/goldielocksViz"
import { Height } from "../styles/variables"

export default function Histogram() {
  return (
    <Layout theme={{ backgroundColor: "black" }}>
      <iframe
        src="/histogram/histogram.html"
        title="D3 Histogram"
        style={{
          width: "100%",
          height: `calc(100vh - ${Height.header})`,
          border: "none",
          overflow: "hidden",
        }}
      ></iframe>
    </Layout>
  )
}
