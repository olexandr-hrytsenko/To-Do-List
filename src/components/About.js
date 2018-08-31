import React from 'react';

const About = () => {
  return (
    <div>
      <h2>Приложение ToDo-list</h2>
      <p>Данные в списке: Дата выполнения, статус выполнения, название, приоритет</p>
      <p>Приложение должно уметь:</p>
      <ol>
        <li>Добавлять/удалять задания</li>
        <li>Менять статус выполнения</li>
        <li>Сохранять локально данные (используйте библиотеку https://github.com/localForage/localForage)</li>
        <li>Выполнять поиск по тексту задания</li>
        <li>Сортировать список по дате, статусу</li>
        <li>Фильтровать список по статусу.</li>
      </ol>
      <p>Для изменения приоритета заданий используйте библиотеку: react-sortable-hoc http://clauderic.github.io/react-sortable-hoc/#/basic-configuration/basic-usage?_k=rsmn37</p>
    </div>
  );
};

export default About;