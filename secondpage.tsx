import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Secondpage.css";

const API_KEY = "9G0U6XY6AXRBY0H5";
const BASE_URL = "https://www.alphavantage.co/query";

const SecondPage = () => {
  const { symbol } = useParams();
  const [companyDetails, setCompanyDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!symbol) {
        console.log("Ingen symbol hämtades i URL.");
        return;
      }

      setLoading(true);
      setError(null);

      // Tar bort .SHH eller något annat från symbolen, om det finns
      const cleanSymbol = symbol.replace(".SHH", "");

      console.log(`Försöker hämta data för symbol: ${cleanSymbol}`);

      try {
        const response = await axios.get(BASE_URL, {
          params: {
            function: "OVERVIEW",
            symbol: cleanSymbol,
            apikey: API_KEY,
          },
        });

        console.log("API Response:", response.data);

        // Kontrollerar om vi når API gräns
        if (response.data.Information) {
          console.log("API LIMIT NÅDD: ", response.data.Information);
          setError("API-limit nådd!");
          return;
        }

        // Kontrollerar om det finns data, och om symbolen verkligen finns i API-svaret
        if (response.data && response.data.Name) {
          setCompanyDetails(response.data);
        } else if (response.data && response.data.Note) {
          // Om det finns en "Note"-fält som säger att vi har npt gränsen för API:et
          console.log("API Note:", response.data.Note);
          setError("API är begränsat, försök igen sen.");
        } else {
          console.log("Ingen data returnerat för denna symbol:", cleanSymbol);
          setError("Företagsinformation hittades inte.");
        }
      } catch (error) {
        console.error("Fel vid API-anropet:", error);
        setError("Ett fel uppstod. Försök igen.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [symbol]);

  return (
    <div className="container">
      <div className="header">
        <h1>SDH Frontend Homework</h1>
      </div>
      <div className="content">
        <button className="backButton" onClick={() => navigate("/")}>
          Go Back
        </button>
        {loading && <p>Retrieving company information...</p>}{" "}
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
        {companyDetails ? (
          <div>
            <h2>{companyDetails.Name}</h2>
            <p>
              <strong>Address:</strong> {companyDetails.Address || "N/A"}
            </p>
            <strong>Market Capitalization:</strong>{" "}
            {companyDetails.MarketCapitalization}
            <div className="companyDetails">
              <p>{companyDetails.Description}</p>
            </div>
          </div>
        ) : (
          <p>No company information to display.</p> /* Om inga data finns */
        )}
      </div>
    </div>
  );
};

export default SecondPage;
