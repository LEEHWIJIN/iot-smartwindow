from coapthon.client.helperclient import HelperClient
import spidev
import time

host = "192.168.0.3"
port = 5683
path = "advanced"

spi = spidev.SpiDev()
spi.open(0, 0)
spi.max_speed_hz = 1350000

def analog_read(channel):
    r = spi.xfer2([1, (8 + channel) << 4, 0])
    adc_out = ((r[1]&3) << 8) + r[2]
    return adc_out
    
while True:
    reading = analog_read(0)
    voltage = reading * 3.3 / 1024
    
    if reading<650 :
        print('reading = %d voltage = %f' % (reading, voltage))    
        client = HelperClient(server=(host, port))
        response = client.put(path=path, payload="w 100", timeout=5)
        print response.pretty_print()
        time.sleep(500)
        response = client.put(path=path, payload="b 0", timeout=5)
        print response.pretty_print()
        client.stop()    
        time.sleep(1000)