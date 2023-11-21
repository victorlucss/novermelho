import React from 'react';


import BaseField from '../interfaces/BaseField';

const renderFields = (fields: BaseField[], errors, register) =>
  fields.map(({ name, type, label, options, value }) => (
    <Bubble
      key={name}
      name={name}
      label={label}
      type={type}
      errors={errors}
      register={register}
      options={options}
      value={value}
      props={{ mb: 5 }}
    />
  ));

export default renderFields;
