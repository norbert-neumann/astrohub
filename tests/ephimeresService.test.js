import fetchMock from 'jest-fetch-mock';
import ephimeresService from '../services/ephimeresService.js';


const mockedResponse = 
`<pre style="text-align: left; margin-left: auto; margin-right: auto;">
     
                      Astronomical Applications Department                      
                             U. S. Naval Observatory                            
                            Washington, DC 20392-5420                           
     
                               Regulus                               
     
                                                                     
          Location:  E 18°54&#39;00.0&#34;, N47°36&#39;00.0&#34;,     0m           
             (Longitude referred to Greenwich meridian)              
     
                        Time Zone: Greenwich                         
     
      Date               Rise  Az.       Transit Alt.       Set  Az.
     (Zone)  
                          h  m   °         h  m  °          h  m   °
2024 Mar 30 (Sat)        13:24  72        20:19 54S        03:19 288                 
2024 Mar 31 (Sun)        13:20  72        20:15 54S        03:15 288                 
2024 Apr 01 (Mon)        13:16  72        20:11 54S        03:11 288                 
2024 Apr 02 (Tue)        13:12  72        20:07 54S        03:07 288                 
2024 Apr 03 (Wed)        13:08  72        20:04 54S        03:03 288                 


</pre>`

describe('ephimeresService', () => {
    beforeEach(() => {
        fetchMock.enableMocks();
    });

    afterEach(() => {
        fetchMock.resetMocks();
    });

    it('should return expected values', async () => {
        fetchMock.mockResponseOnce(mockedResponse)

        const result = await ephimeresService.getStarEphimeres(1, 1, [-12]);
        console.log(result)
        expect(result).toBe('mocked response');
    });
});
