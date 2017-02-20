"use strict";

const React = require('react');
const { GridList, GridTile } = require('material-ui/GridList');
const Subheader = require('material-ui/Subheader').default;


const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        width: 600,
        overflowY: 'auto',
    },
    gridTile: {
        width: '150px',
        height: '200px',
    },
};

class ResultList extends React.Component {

    render() {
        const { results } = this.props;

        if (results.length === 0) {
            return (
                <div>
                    0 results
                </div>
            );
        }

        return (
            <div style={styles.root}>
                <Subheader>{results.length} Results:</Subheader>

                <GridList
                    cellHeight={200}
                    cols={4}
                    style={styles.gridList}>

                    {results.map((tile) => (
                        <GridTile
                            style={styles.gridTile}
                            key={tile.url}
                            title={tile.title}>
                            <img src={tile.imageUrl} />
                        </GridTile>
                    ))}
                </GridList>
            </div>
        )
    }
}

ResultList.propTypes = {
    results: React.PropTypes.array.isRequired,
};


module.exports = ResultList;
