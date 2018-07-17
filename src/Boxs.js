import React from 'react';
import localforage from 'localforage/dist/localforage';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => {
  return(
    <span>
      <label>Статус:</label>
      <br />
      <label>Дата выполнения:</label>
    </span>
  )});

const SortableItem = SortableElement(({value}) => <div className="box">{value}<hr />< DragHandle/></div>);
                                     
const SortableList = SortableContainer(({items}) => {
    return (
      <div className="container">
        {items.map((item, index) => {
          return <SortableItem key={`item-${index}`} index={index} value={item} />;
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
      var arr = farr.map(function(item) {
        return (item.text);
      });
      self.setState({ list: arr });
    });

  }

  onSortEnd({oldIndex, newIndex}) {
    this.setState({
      list: arrayMove(this.state.list, oldIndex, newIndex)
    });
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