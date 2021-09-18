import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Axios from '../axios-config';
import { SeriesListitem } from '../components/SeriesListItem';

export const Series = () => {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      Axios.get('/series')
        .then(({ data }) => {
          setSeries(data.content);
        })
        .catch((err) => {
          if (err.isAxiosError) {
            toast.error(`Could not load series: ${err.response?.data.message}`);
          } else {
            toast.error(`Could not load series: ${err}`);
          }
        });
    };

    fetchChallenges();
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 m-5">
        {series.length === 0 && <span>Nothing to show here.</span>}
        {series.map((serie, index) => (
          <SeriesListitem serie={serie} key={`serie-${index}`} />
        ))}
      </div>
    </>
  );
};
