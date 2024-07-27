import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { DonutData } from './App';

const DonutGraph = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (data && d3Container.current) {
      const width = 400;
      const height = 400;
      const margin = 40;
      const radius = Math.min(width, height) / 2 - margin;

      // Clear previous content
      d3.select(d3Container.current).selectAll('*').remove();

      // Create SVG
      const svg = d3.select(d3Container.current)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      // Create color scale
      const color = d3.scaleOrdinal()
        .domain(data.map(d => d.label))
        .range(data.map(d => d.color));

      // Compute the position of each group on the pie
      const pie = d3.pie()
        .value(d => d.value);

      const data_ready = pie(data);

      // Shape helper to build arcs
      const arc = d3.arc()
        .innerRadius(radius * 0.5)         // This is the size of the donut hole
        .outerRadius(radius * 0.8);

      // Build the pie chart
      svg.selectAll('path')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.color))
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .style('opacity', 0.7);

      // Add labels
      svg.selectAll('text')
        .data(data_ready)
        .enter()
        .append('text')
        .text(d => d.data.label)
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .style('text-anchor', 'middle')
        .style('font-size', 15);
    }
  }, [data]);

  return (
    <svg
      className="d3-component"
      ref={d3Container}
    />
  );
};

export default DonutGraph;