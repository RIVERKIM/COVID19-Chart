import { Component, OnInit } from '@angular/core';
import {DataServiceService} from '../../services/data-service.service';
import {GlobalDataSummary} from '../../models/global-data';
import {DateWiseData} from '../../models/date-wise-data';
import {merge} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {
	totalConfirmed = 0;
	totalActive = 0;
	totalDeaths = 0;
	totalRecovered = 0;
	dateWiseData: any;
	selectedCountryData: DateWiseData[]	
	loading = true;
	data: GlobalDataSummary[];
	countries: string[] = [];
	
	myFormatters = [
		{
			formatter: new google.visualization.DateFormat({ formatType: 'long' }),
		}
	]
	
	options = {
		height: 500,
		options: {
			animation: {
				duration: 1000,
				easing: 'out'
			},
			is3D: true
		}
	}

  constructor(private service: DataServiceService) { }

  ngOnInit(): void {
	  
	  merge(
		   this.service.getDateWiseData().pipe(
		  map(result => {
			  this.dateWiseData = result;
		  })
	  ),
	  
	  this.service.getGlobalData().pipe(map(result => {
		  this.data = result;
		  this.data.forEach(cs => {
			  this.countries.push(cs.country);
		  })
	  }))
	  ).subscribe({
		  complete: () => {
			  this.updateValues('"Korea, South"');
			  this.loading = false;
		  }
	  }
	  )
	  
	 
  }
	
	updateChart() {
		let dataTable = new google.visualization.DataTable();
		dataTable.addColumn('date', 'Date');
		dataTable.addColumn('number', 'Cases');
		let data = [];
		let formatter_long = new google.visualization.DateFormat({formatType: 'long'});
		this.selectedCountryData.forEach((cs) => {
			data.push([cs.date,cs.cases]);
		});
		dataTable.addRows(data);
		formatter_long.format(dataTable, 0);
		
		let chart = new google.visualization.LineChart(document.getElementById('chart'));
		chart.draw(dataTable, this.options);
		
		
		
	}
	
	updateValues(country: string) {
		this.data.forEach(cs => {
			if(cs.country == country) {
				this.totalActive = cs.active;
				this.totalConfirmed = cs.confirmed;
				this.totalDeaths = cs.deaths;
				this.totalRecovered = cs.recovered;
			}
		})
		console.log(this.dateWiseData);
		this.selectedCountryData = this.dateWiseData[country];
		this.updateChart();
	}

}
