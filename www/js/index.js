/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
	debug: function(text)
	{
		var p = document.createElement('p');
		p.innerHTML = text || '';
		document.getElementById('debug').appendChild(p);
	},
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
		fb.init();
    }
};

var fb = {
	init: function()
	{
		FB.init(
        {
			appId: '1434579543483455',
			nativeInterface: CDV.FB,
			useCachedDialogs: false,
			status: false
        });
		app.debug('init ok');
		fb.binds();
		fb.status();
	},
	binds: function()
	{
		FB.Event.subscribe('auth.statusChange', function(authResponse)
		{
			app.debug('Status change...');
			console.log( authResponse );
		});
		FB.Event.subscribe('auth.login', function(authResponse)
		{
			app.debug('Login capturado...');
			console.log( authResponse );
		});
		FB.Event.subscribe('auth.logout', function(authResponse)
		{
			app.debug('Logout capturado...');
			console.log( authResponse );
		});
	},
	login: function(scope)
	{
		FB.login(function(response)
		{
			if ( response.authResponse )
			{
				app.debug('Usuario logeado... obteniendo informacion');
				fb.info();
			}
			else
			{
				app.debug('Usuario rechazo login');
			}
		},
		{
			scope: scope || 'email'
		});
	},
	status: function()
	{
		FB.getLoginStatus(function(response)
		{
			if ( response.status === 'connected' )
			{
				app.debug('Logeado. ID: ' + response.authResponse.userId + ' -- Access Token: ' + response.authResponse.accessToken);
				fb.info();
			}
			else if ( response.status === 'not_authorized' )
			{
				app.debug('Logeado pero no autorizado');
			}
			else
			{
				app.debug('No logeado');
			}
		}, true);
	},
	info: function()
	{
		app.debug('API call: /me');
		FB.api('/me', { fields: 'id, name, email' }, function(response)
		{
			if ( ! response || response.error )
			{
				app.debug('Error al obetener datos de usuario');
			}
			else
			{
				app.debug('UID ' + response.id);
				app.debug('Nombre: ' + response.name);
				app.debug('Email: ' + response.email);
			}
		});
	},
	logout: function()
	{
		app.debug('Desconectando usuario...');
		FB.logout(function()
		{
			app.debug('Logout OK');
		});
	},
	share: function()
	{
		var params		= {
				method: 'feed',
				name: 'NOMBRE SHARE',
				caption: 'CAPTION SHARE',
				description: 'DESCRIPTION SHARE',
				link: 'http://google.cl',
				picture: 'http://placehold.it/200x200'
			},
			callback		= function(response)
			{
				if ( ! response || response.error )
				{
					app.debug('Error al obetener datos de usuario');
				}
				else
				{
					app.debug('Share OK');
				}
			};

		try
		{
			if ( FB._nativeInterface )
			{
				app.debug('Compartiendo formato nativo...');
				FB._nativeInterface.dialog(params, callback, function()
				{
					app.debug('Error al compartir.');
				});
			}
			else
			{
				app.debug('Compartiendo formato web...');
				FB.ui(params, callback);
			}
		}
		catch (error)
		{
			app.debug('Error al compartir.');
		}
	}
}
