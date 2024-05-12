const singleRowResponse = 
`
<pre style="text-align: left; margin-left: auto; margin-right: auto;">
     
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
2024 Mar 01 (Fri)        10:00  72        20:19 54S        10:05 288                                


</pre>
`

const singleRowResponseWithDayBoundaryCross = 
`
<pre style="text-align: left; margin-left: auto; margin-right: auto;">
     
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
2024 Mar 01 (Fri)        23:59  72        20:19 54S        00:01 288                                


</pre>
`

const multiRowResponse =
`
<pre style="text-align: left; margin-left: auto; margin-right: auto;">
     
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
2024 May 12 (Sun)        10:35  72        17:30 54S        00:30 288                 
2024 May 13 (Mon)        10:31  72        17:26 54S        00:26 288                 
2024 May 14 (Tue)        10:27  72        17:22 54S        00:22 288                                 


</pre>
`

const multiRowResponseWithInvalidRow =
`
<pre style="text-align: left; margin-left: auto; margin-right: auto;">
     
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
2024 May 19 (Sun)        10:07  72        17:03 54S        00:02 288                 
                                                           23:58 288 
2024 May 20 (Mon)        10:03  72        16:59 54S        23:54 288                                 


</pre>
`

export default {
    singleRowResponse,
    singleRowResponseWithDayBoundaryCross,
    multiRowResponse,
    multiRowResponseWithInvalidRow
}