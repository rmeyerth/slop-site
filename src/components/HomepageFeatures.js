import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Dynamic Configuration',
    Svg: require('../../static/img/Wrench_Icon.svg').default,
    description: (
      <>
        Deploy code to your project dynamically. Expressions are stored and executed as
        plain text which can be stored on database records, documents, objects, files or anywhere!
      </>
    ),
  },
  {
    title: 'Powered by Java',
    Svg: require('../../static/img/rocket.svg').default,
    description: (
      <>
        Pass and reference objects directly in SLOP expressions. Native calls unlock
        the power of the underlying language to provide limitless possibilities.
      </>
    ),
  },
  {
    title: 'Extensible',
    Svg: require('../../static/img/construction-cone.svg').default,
    description: (
      <>
        Missing the feature you're looking for? Using the in-built grammar system, it's easy to 
        expand the language by writing your own functions, literals, operations and statements.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
