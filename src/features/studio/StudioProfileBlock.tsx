export function StudioProfileBlock({
  name,
  image,
  intro
}: {
  name: string;
  image: string;
  intro: string;
}) {
  return (
    <article className="studio-profile">
      <div className="studio-profile__media">
        <img src={image} alt={`${name} en el estudio de ceramica`} />
      </div>
      <div className="studio-profile__copy">
        <h2>{name}</h2>
        <p className="studio-profile__role">
          Ceramista y especialista en quimica ceramica
        </p>
        <p>{intro}</p>
        <p>
          Mi relacion con la ceramica va mas alla del taller: me apasiona la
          quimica que hay detras de cada esmalte y la forma en que los
          materiales se transforman con el fuego. Esa mezcla entre arte y
          ciencia es lo que me mueve a seguir experimentando, combinando
          elementos y descubriendo nuevas texturas y colores.
        </p>
        <p>
          Despues de anos de estudio, trabajo e investigacion, he aprendido que
          la ceramica no tiene secretos inalcanzables, solo procesos que merecen
          ser comprendidos. Por eso, mi proposito es compartir lo que se,
          ensenar con honestidad y acercar a mas personas a esa alquimia
          maravillosa que ocurre cuando la tierra, el fuego y la curiosidad se
          encuentran.
        </p>
      </div>
    </article>
  );
}
