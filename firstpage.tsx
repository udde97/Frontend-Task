import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Firstpage.css";

const API_KEY = "9G0U6XY6AXRBY0H5";
const BASE_URL = "https://www.alphavantage.co/query";

const FirstPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stocks, setStocks] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [apiLimitReached, setApiLimitReached] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (apiLimitReached) {
      const timer = setTimeout(() => {
        setApiLimitReached(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [apiLimitReached]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    console.log("Searching for:", searchQuery);

    try {
      const response = await axios.get(BASE_URL, {
        params: {
          function: "SYMBOL_SEARCH",
          keywords: searchQuery,
          apikey: API_KEY,
        },
      });

      console.log("API Response:", response.data);

      if (response.data.Note || response.data.Information) {
        console.log("API limit reached");
        setApiLimitReached(true);
        setStocks([]);
      } else if (response.data && response.data.bestMatches) {
        setStocks(response.data.bestMatches);
        setApiLimitReached(false);
      } else {
        setStocks([]);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      setStocks([]);
    }
  };

  const addToPortfolio = (stock: any) => {
    setPortfolio([...portfolio, stock]);
  };

  const removeFromPortfolio = (symbol: string) => {
    setPortfolio(portfolio.filter((stock) => stock["1. symbol"] !== symbol));
  };

  const navigateToDetails = (symbol: string) => {
    navigate(`/secondpage/${symbol}`);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>SDH Frontend Homework</h1>
      </div>
      <div className="body">
        <div className="companyView">
          <div className="companyName">
            <span>Company Name</span>
          </div>
          <div className="search">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Example apple"
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          {apiLimitReached && (
            <div className="api-error">API limit request has been reached</div>
          )}
        </div>

        <div className="split">
          <div className="left">
            <h2>Search Results</h2>
            <ul>
              {stocks.length > 0 ? (
                stocks.map((stock: any) => (
                  <li key={stock["1. symbol"]}>
                    <span>
                      {stock["1. symbol"]} - {stock["2. name"]}
                    </span>
                    <button onClick={() => addToPortfolio(stock)}>+</button>
                  </li>
                ))
              ) : (
                <p>No stocks found, try again.</p>
              )}
            </ul>
          </div>
          <div className="diagonal-line"></div>

          <div className="right">
            <h2>Your Portfolio</h2>
            <table>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Symbol</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.length > 0 ? (
                  portfolio.map((stock: any) => (
                    <tr key={stock["1. symbol"]}>
                      <td>
                        <button
                          onClick={() => navigateToDetails(stock["1. symbol"])}
                        >
                          {stock["2. name"]}
                        </button>
                      </td>
                      <td>{stock["1. symbol"]}</td>
                      <td>
                        <button
                          onClick={() =>
                            removeFromPortfolio(stock["1. symbol"])
                          }
                        >
                          remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>No shares in the portfolio.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstPage;
