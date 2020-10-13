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
        width: window.innerWidth * 0.5,
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

    const tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('visibility', 'hidden')
                    .style('width', 'auto')
                    .style('height', 'auto')

    const barGroup = bounds.selectAll('g')
                            .data(dataset)
                            .enter()
                            .append('g')

    const barWidth = dimensions.boundedWidth/dataset.length

    const barsRect = barGroup.append('rect')
                                .transition()
                                .attr("x", d => xScale(xAccessor(d)))
                                .attr("y", d => yScale(yAccessor(d)))
                                .attr("width",barWidth )
                                .attr('height', d =>dimensions.boundedHeight - yScale(yAccessor(d)))
                                .attr("class", "bar")
                                .attr("data-date", d => d[0])
                                .attr("data-gdp", d => yAccessor(d))
                                .attr("fill", "cornflowerblue")
   
    d3.selectAll('rect').on('mouseover', function(datum,index,nodes){
        
        tooltip.transition()
            .style('visibility', 'visible')
        tooltip.text(index[0])
        document.querySelector('#tooltip').setAttribute('data-date', index[0])
    }).on('mouseout', (item) => {
        tooltip.transition()
            .style('visibility', 'hidden')
    })  

    
    //const titlesRect = barGroup.append('title')
    //                            .attr('id',"tooltip")
    //                            .attr("data-date", d => d[0])
    //                            .text(d => d[0])
    //Draw Peripherals

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
}

drawBarChart()