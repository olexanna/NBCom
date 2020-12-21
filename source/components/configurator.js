import React from "react";
import "@styles/app.scss"
import "@styles/configurator.scss";
import "@styles/reset.scss";

const ConfiguratorTitle = [
	"Тип устройства",
	"Конфигурация",
	"Комплектация"
];

export default class Configurator extends React.Component{

	constructor( props ){
		super( props );

		this.state = {
			step: 1,
			list: []
		};
	}

	getList( ){

		fetch( "/requests/list.json" )
			.then( response => response.json() )
			.then( data => {

				let list = [];

				for( let key in data ){

					const config = data[ key ].config;
					const params = {
						title: data[ key ].title,
						code: data[ key ].code,
						selectedId: -1,
						opened: true,
						config: []
					};
					list.push( params );

					for( let unit in config ){
						const items =  config[ unit ];
						params.config.push({
							id: items.id,
							text: items.text,
							extend: items.extend,
							bundle: items.bundle,
							add: items.add === false ? false : true
						});
					};

				};
				console.log( list, list.config );
				this.setState({ list: list });

			}).catch( error => {});
	};

	toggle( code ){

		let list = [ ...this.state.list ];

		for( const line of list ){

			if( line.code !== code )
				continue;

			line.opened = !line.opened;
		}

		this.setState({ list: list });
	};

	change( code, id, add ){

		if( !add )
			return;

		let list = [ ...this.state.list ];

		for( const line of list ){

			if( line.code !== code )
				continue;

			line.selectedId = id;
		}

		this.setState({ list: list });
	};

	configuration(){
		return (
			<section className={"configurator-block"}>{
				this.state.list.map(( line  )=>{
					return(
						<div className={"configurator-block-line"} key={ line.code }>
							<div className={"configurator-block-line-title"}>
								<p className={"configurator-block-line-title-text"} >{ line.title }</p>
								<p className={"configurator-block-line-title-expand"} onClick={() => { this.toggle( line.code ) }}>+</p>
							</div>

							<div className={"configurator-block-line-elem"  + (line.opened ? "" : " configurator-block-line-closed")} >
								{ line.config.map(( config,cell ) => {
									return (
										<div className={"configurator-cell"  } key={ config.id } >
											<input
												type={"radio"}
												name= { config.text }
												value={ config.text }
												checked={ line.selectedId == config.id ? true : false }
												disabled={ config.add ? false : true }
												onChange={() => { this.change( line.code, config.id, config.add ) }}
											></input>
											<label
												onClick={() => { this.change( line.code, config.id, config.add ) }}
											>{ config.text }</label>
										</div>
									);
								}) }
							</div>
						</div>
					)
				})
			}</section>);
	};

	selectedConfig( line ){

		for( const config of line.config ){

			if( config.id === line.selectedId )
				return config.text;
		}

		return "Не выбран";
	};

	bundle(){
		return (
			<div className={"configurator-bundle"}>{
				this.state.list.map(( line ) =>{
					return (
						<div className={"configurator-line"} key={ line.code }>
							<div className={"configurator-line-title"}>{ line.title }</div>
							<div className={"configurator-line-elem"}>{ this.selectedConfig( line ) }</div>
						</div>
					)
				})
			}</div>);
	};

	componentDidMount(){
		this.getList();
	}

	render(){
		return(
			<article className={"configurator"}>
				<header className={ "configurator-header" }>
					<div className={ "configurator-header-elem" + (this.state.step === 0 ? " configurator-header-selected" : "") }>
						<span className={"configurator-header-elem-num"}>{ 1 }</span>
						{ ConfiguratorTitle[ 0 ] }
					</div>

					<div className={"configurator-header-elem-arrow"}></div>
					<div className={ "configurator-header-elem" + (this.state.step === 1 ? " configurator-header-selected" : "") }
						 onClick={() => { this.setState({ step: 1 }) }}
					>
						<span className={"configurator-header-elem-num" + (this.state.step === 1 ? " configurator-header-elem-selected-num" : "") } >{ 2 }</span>
						{ ConfiguratorTitle[ 1 ] }
					</div>

					<div className={"configurator-header-elem-arrow"}></div>
					<div className={ "configurator-header-elem" + (this.state.step === 2 ? " configurator-header-selected" : "") }>
						<span className={"configurator-header-elem-num" + (this.state.step === 2 ? " configurator-header-elem-selected-num" : "") } >{ 3 }</span>
						{ ConfiguratorTitle[ 2 ] }
					</div>
				</header>
				{ this.state.step === 1 ? this.configuration() : this.bundle() }
				<footer className={ "configurator-footer" }>
					{ this.state.step === 1 ? (
						<div className={ "configurator-footer-button" } onClick={() => { this.setState({ step: 2 }) }}>Перейти к комплектации</div>
					) : (
						<div className={ "configurator-footer-button" }>Заказать</div>
					) }
				</footer>
			</article>
		)
	}
}