import React, { useEffect } from 'react';

export function Planeta({ nombre }) {
  useEffect(() => {
    console.log(`¡El planeta ${nombre} ha aparecido!`); // Montaje

    return () => {
      console.log(`¡El planeta ${nombre} ha desaparecido!`); // Desmontaje
    };
  }, []);

  return <div>{nombre}</div>;
}