import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, CardGroup, Col, Container, Row } from 'react-bootstrap';
import './App.css';


function App() {
  const [endPoints, setEndPoints] = useState('');
  const [container, setContainer] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    const baseUrl = `https://online-movie-database.p.rapidapi.com/auto-complete?q=${endPoints}`;
    const apiKey = '81d557399dmshd6b006bfdebff1bp13c151jsnda43277d563c';

    try {
      const response = await fetch(baseUrl, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'online-movie-database.p.rapidapi.com',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseBody = await response.text();

      if (!responseBody.trim()) {
        console.error('Empty response received.');
        setContainer([]);
        setError('No movies or TV shows found for the given query. Please try a different search term.');
        return;
      }
  
      const result = JSON.parse(responseBody);
     
        if (!result.d) {
          console.error('Empty or invalid response received.');
          setError('No movies or TV shows found for the given query. Please try a different search term.');
        } else {
          setContainer(result.d);
        }
      } catch (error) {
        console.error(error);
        console.log("Checking error=>", error)
        setError('An error occurred while fetching data.');
      } finally {
        setIsLoading(false);
      }
  };

  const onChangeHandler = (e) => {
    setEndPoints(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setHoveredCard(null);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  },[endPoints]);

  const handleMouseEnter = (index) => {
    setHoveredCard(index);
  };
  // console.log("mouseEnter->",handleMouseEnter);

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  return (
    <>
      <Container className="d-flex justify-content-center mt-5 ml-5 mr-5">
        <Row>
           <Col>
              <h1 className="h1-info display-4">Movies & TV Shows Info </h1>
              <form onSubmit={onSubmitHandler}>
              <div className="input-group">
                <input
                  type="text"
                  value={endPoints}
                  onChange={onChangeHandler}
                  placeholder="Search"
                  className="form-control"
                />
                <div className="input-group-append">
                  <Button type="submit" disabled={isLoading} variant="success" className="border-rounded">
                    {isLoading ? 'Loading...' : 'Search'}
                  </Button>
                </div>
              </div>
              </form>
              <p className="text-muted info-box p-4 border rounded mt-5">
                 Welcome to Movies & TV Shows Info! This application allows you to search for information about your favorite movies and TV shows. <br/> Enter the name of a movie or TV show in the search bar, and we will provide you with details, ratings, and more. Enjoy exploring the world of entertainment!
              </p>
           </Col>
        </Row>
      </Container>

      {/* Display error message */}
      <Container className="d-flex justify-content-center mt-5">
      {error && (
        <div className={`alert ${error.includes('Network') ? 'alert-danger' : 'alert-success'}`}>
          {error.includes('Network') ? 'Network error. Please check your internet connection.' : error}
        </div>
      )}
      </Container>


        <Container>
            <CardGroup>
               {container.map((item, index) => (
                 <div className={`card-col ${hoveredCard === index ? 'hover' : ''}`}
                      key={index}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                    >
                  <Card>
                  <div className="card-container">
                    <div className="front" style={{ backgroundImage: `url(${item?.i?.imageUrl})`}}>
                      <div className="inner">
                        <p>{item.l}</p>
                        {/* <span>Lorem ipsum</span> */}
                      </div>
                    </div>
                   <div className="back">
                     <div className="inner">
                       <p>
                        {item.s}
                      </p>
                  </div>
                  </div>
                  </div>
                  </Card>     
                </div>
              ))}
               
            </CardGroup>
        </Container>
    </>
  );
}

export default App;
