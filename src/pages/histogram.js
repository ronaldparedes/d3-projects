import React from "react"
import Header from "../components/header"
import Layout from "../components/layout"

export default function Histogram() {
  return (
    <Layout theme={{ backgroundColor: "pink" }}>
      <div style={{ color: "purple" }}>
        <Header headerText="Histogram" />
        <p>Send us a message!</p>
        <img src="https://source.unsplash.com/random/400x200" alt="" />
      </div>
    </Layout>
  )
}
