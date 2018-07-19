import React from 'react';
import localforage from 'localforage/dist/localforage';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => {
  return(
    <span>
      <img src="drag-reorder.png" />
    </span>
  )});

const SortableItem = SortableElement(({value, date, status}) => (
    <div className="box">{value}
        <hr />
        <label>Статус:</label>
        <br />
        <label>Дата выполнения: </label>
        <input type='date' defaultValue={date} />
        <hr />< DragHandle/>
    </div>
    )
);
                                     
const SortableList = SortableContainer(({items}) => {
    return (
      <div className="container">
        {items.map((item, index) => {
          return <SortableItem key={`item-${index}`+Math.floor((Math.random()*1000)).toString()} index={index} value={item.text} date={item.date} status={item.status} />;
        })}
      </div>
    );
});



class Boxs extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
        list: []
    }
  }
  
  componentDidMount() {
    const self = this;

    localforage.getItem('arr_save', function (err, farr) {
      if (farr == null) {
        farr = [];
      }
      //var arr = farr.map(function(item) {
      //  return (item.text);
      //});
      self.setState({ list: farr });
    });

  }

  onSortEnd({oldIndex, newIndex}) {
    this.setState({
      list: arrayMove(this.state.list, oldIndex, newIndex)
    });
    //alert(Math.floor((Math.random()*1000)).toString());
    var arr = this.state.list;
    localforage.setItem('arr_save', arr);
    //this.props.arrMove(oldIndex, newIndex);
    //console.log(oldIndex, newIndex)
  }
  // useDragHandle = {true}
  render() {
    //const self = this;
   // onSortEnd={({oldIndex, newIndex, collection}, e) => (self.props.arrMove(oldIndex, newIndex))}
    return (
      <div>
        <SortableList items={this.state.list} onSortEnd={this.onSortEnd.bind(this)} axis='xy'  />
      </div>
    );
  }
};
export default Boxs;