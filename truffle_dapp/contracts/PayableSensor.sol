contract PayableSensor
{

    struct Client
    {
        address clAddress;
        string publicKey;
        bool exists;
    }

    struct Sensor
    {
        uint price;
        string description;
        string data;
        mapping (address => Client) clients;
        //Client[] clients;
        bool exists;
    }

    //Sensor[] public sensors;
    mapping (address => Sensor) public sensors;

    // Constructor
    function PayableSensor()
    {
    }

    // Add a sensor to the smart contract
    function AddSensor(uint _price, string _description)
    {
        sensors[msg.sender] = Sensor({price : _price, description : _description, data : "", exists: true});
    }

    function RemoveSensor() returns (uint8)
    {
        if (sensors[msg.sender].exists != true)
        {
            delete sensors[msg.sender];
            return 0;
        }
        else
        {
            return 255;
            throw;
        }
    }

    function testSend(address _rxAddress, uint _amount) returns (uint8)
    {
      string memory payload;
      payload = "_-_pKey:0x12345678901234567890123456789012_-_cAddress:";

      _rxAddress.call.value(_amount * 1 ether)(payload);
      return 0x00;
    }

    function BuyData(address _snAddress, string _publicKey) returns (uint8)
    {

        Client memory currentClient = Client({clAddress : msg.sender, publicKey : _publicKey, exists: true});
        uint _data = 0x1337;
        if (msg.value >= sensors[_snAddress].price)
        {
            sensors[_snAddress].clients[msg.sender] = currentClient;
            _snAddress.call.value(msg.value)(_data);
            return 200;
        }
        else
        {
            return 255;
            throw;
        }
    }

    function ()
    {
        throw;
    }
}
