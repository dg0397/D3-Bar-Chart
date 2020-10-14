async function drawBarChart(){
    //1)Acces Data
    console.log(d3)
    //Fetching data

    const {data : dataset} = await d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")

    //Seeting accesors functions 

     
    const yAccessor = d => d[1]

    const dateParser = d3.timeParse("%Y-%m-%d") // to parse time values
    const xAccessor = d => dateParser(d[0])
    

    //2) Create Chart Dimensions

    let dimensions = {
        width: window.innerWidth * 0.9 <= 600 ? window.innerWidth * 0.9 : 800,
        height: 400,
        margin: {
            top: 30,
            right: 30,
            bottom: 30,
            left: 60,
        },
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left  - dimensions.margin.right ;
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom ;

    //3) Draw Canvas 

    //adding main svg 

    const wrapper = d3.select("#wrapper")
                        .append('svg')
                        .attr('width',dimensions.width)
                        .attr('height',dimensions.height)

    //adding bound(framework or whiteboard)

    const bounds = wrapper.append('g')
                            .style('transform', `translate(${
                                dimensions.margin.left
                            }px, ${
                                dimensions.margin.top
                            }px)`);

    //4) Create Scales

    //Setting scales

    const yScale = d3.scaleLinear()
                        .domain(d3.extent(dataset,yAccessor))
                        .range([dimensions.boundedHeight,0])
                        .nice();

    const xScale = d3.scaleTime()
                        .domain(d3.extent(dataset,xAccessor)) 
                        .range([0,dimensions.boundedWidth])
                        .nice();

    //5) Draw Data

    const updateTransition = d3.transition().duration(1000);

    const tooltip = d3.select('.main')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('visibility', 'hidden')
                    
    const barWidth = dimensions.boundedWidth/dataset.length

    const barRects = bounds.selectAll('rect')
                            .data(dataset)
                            .enter()
                            .append('rect')
                            .attr("x", d => xScale(xAccessor(d)))
                            .attr("y", dimensions.boundedHeight)
                            .attr("width",barWidth )
                            .attr('height', 0)
                            .attr("class", "bar")
                            .attr("data-date", d => d[0])
                            .attr("data-gdp", d => yAccessor(d))
                            .style("fill", "yellowgreen")
                            .style("opacity","1");

    barRects.transition(updateTransition)
            .attr("y", d => yScale(yAccessor(d)))
            .attr('height', d =>dimensions.boundedHeight - yScale(yAccessor(d)))
            .style("fill", "cornflowerblue")
                        
    
    //6)Draw Peripherals

    //Setting axis 

    const xAxisGenerator = d3.axisBottom()
                                .scale(xScale)

    const yAxisGenerator = d3.axisLeft()
                                .scale(yScale)

    //Adding Axis

    const xAxis = bounds.append('g')
                        .attr("id","x-axis")
                        .style("transform", `translateY(${dimensions.boundedHeight}px)`)
                        .call(xAxisGenerator);
    
    const yAxis = bounds.append('g')
                        .attr("id","y-axis")
                        .call(yAxisGenerator);

    //7)Set up interactions

    //Adding tooltip interactions with rects

    barRects.on('mouseenter', function(datum,index,nodes){
            d3.select(this).style('fill','rgba(100 ,149 ,237 ,.5)')
            tooltip
            .style('visibility', 'visible')
            .text(`${index[0]} --- $${index[0]} Billion`)
            .attr('data-date', index[0])
    }).on('mouseout', function(datum,index,nodes){
            d3.select(this).style("fill", "cornflowerblue")
            tooltip
            .style('visibility', 'hidden')
    }) 
}

drawBarChart()